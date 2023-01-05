import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  D3ForceGraph,
  DEFAULT_FORCE_GRAPH_OPTIONS,
  ForceGraphOptions,
  GraphData,
  GraphNode,
} from './d3-force-graph';

/**
 * Simple D3 directed force graph.
 */
@Component({
  selector: 'cadmus-force-graph',
  template: '<svg:svg #fg [id]="id"></svg:svg>',
  styles: [
    `
           :host ::ng-deep .links line {
             stroke: #999;
             stroke-opacity: 0.6;
           }
     
           :host ::ng-deep .nodes circle {
             stroke: #fff;
             stroke-width: 1.5px;
           }
     
           :host ::ng-deep text {
             font-family: sans-serif;
             font-size: 10px;
           }
     
           :host ::ng-deep .nodes circle.pinned {
             stroke: orange;
           }
         `,
  ],
})
export class ForceGraphComponent implements OnInit, AfterViewInit {
  private _id: string;
  private _data: GraphData;
  private _options: ForceGraphOptions;
  private _graph: D3ForceGraph | undefined;
  private _paused: boolean;

  @ViewChild('fg', { static: false }) svgRef: ElementRef | undefined;

  /**
   * The ID assigned to the host SVG element.
   * Default is force-graph.
   */
  @Input()
  public get id(): string {
    return this._id;
  }
  public set id(value: string) {
    this._id = value;
    if (this._graph) {
      this.reset();
    }
  }

  /**
   * True to size the SVG element to fit its window.
   */
  @Input()
  public fitWindow: boolean;

  /**
   * The graph options.
   */
  @Input()
  public get options(): ForceGraphOptions {
    return this._options;
  }
  public set options(value: ForceGraphOptions) {
    this._options = value;
    if (this._graph) {
      this.reset();
    }
  }

  @Input()
  public get jsonOptions(): string {
    return JSON.stringify(this._options);
  }
  public set jsonOptions(value: string) {
    this.options = value ? JSON.parse(value) : DEFAULT_FORCE_GRAPH_OPTIONS;
  }

  /**
   * The graph data.
   */
  @Input()
  public get data(): GraphData {
    return this._data;
  }
  public set data(value: GraphData) {
    this._data = value;
    if (this._graph) {
      this.reset();
    }
  }

  @Input()
  public get jsonData(): string {
    return JSON.stringify(this._data);
  }
  public set jsonData(value: string) {
    this.data = value ? JSON.parse(value) : { nodes: [], links: [] };
  }

  @Input()
  public get paused(): boolean {
    return this._paused;
  }
  public set paused(value: boolean) {
    if (this._paused === value) {
      return;
    }
    this._paused = value;
    if (this._graph) {
      if (value) {
        this._graph.stop();
      } else {
        this._graph.start();
      }
    }
  }

  @Output()
  public nodeClick: EventEmitter<GraphNode>;

  constructor() {
    this._id = 'force-graph';
    this.fitWindow = false;
    this._data = {
      nodes: [],
      links: [],
    };
    this._options = DEFAULT_FORCE_GRAPH_OPTIONS;
    this._options.nodeClick = (node) => {
      this.nodeClick.emit(node);
    };
    this._paused = true;
    this.nodeClick = new EventEmitter<GraphNode>();
  }

  ngOnInit(): void {}

  private resizeGraph(): void {
    if (!this.svgRef) {
      return;
    }
    const p = this.svgRef.nativeElement.parentElement as HTMLElement;
    this._options.width = p.clientWidth || this._options.width;
    this._options.height = p.clientHeight || this._options.height;
    this.reset();
  }

  public ngAfterViewInit() {
    this.reset();

    fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe((event) => {
        if (this.svgRef && this.fitWindow) {
          this.resizeGraph();
        }
      });

    if (this.fitWindow) {
      this.resizeGraph();
    }
  }

  private reset(): void {
    this._graph = new D3ForceGraph(this.options, this._data);
    if (this._paused) {
      this._graph.stop();
    }
  }
}
