import { Component } from '@angular/core';
import { CadmusShopAssetService } from '@myrmidon/cadmus-shop-asset';
import { CadmusModel } from '@myrmidon/cadmus-shop-core';
import {
  ForceGraphOptions,
  GraphData,
  GraphNode,
} from '@myrmidon/cadmus-show-viz';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-model-graph-page',
  templateUrl: './model-graph-page.component.html',
  styleUrls: ['./model-graph-page.component.css'],
})
export class ModelGraphPageComponent {
  public options: ForceGraphOptions;
  public data: GraphData;
  public paused: boolean;
  public message?: string;
  public model: CadmusModel | undefined;

  constructor(private _shopService: CadmusShopAssetService) {
    this.options = {
      svgId: 'force-graph',
      width: 800,
      height: 800,
      nodeRadius: 10,
      distance: 100,
      initialZoom: 1.25,
    };
    this.data = {
      nodes: [],
      links: [],
    };
    this.paused = false;
    _shopService
      .loadObject<GraphData>('graph')
      .pipe(take(1))
      .subscribe((d) => {
        this.data = d;
      });
  }

  public onNodeClick(node: GraphNode): void {
    // a project label is capitalized
    if (node.label === node.label?.toUpperCase()) {
      return;
    }
    const id = node.id as string;
    const fragment = id.startsWith('fr.');
    this._shopService.getModel(id, fragment).subscribe((m) => {
      if (m) {
        this._shopService.getModelDetails(m).subscribe((dm) => {
          this.model = dm;
        });
      }
    });
  }

  public togglePause(): void {
    this.paused = !this.paused;
  }

  public reset(): void {
    const d = this.data;
    this.data = {
      nodes: [],
      links: [],
    };
    setTimeout(() => {
      this.data = d;
    }, 1000);
  }
}
