import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FacetDefinition } from '@myrmidon/cadmus-core';
import { FacetListQuery, FacetListService, PartDefinitionVmService } from '@myrmidon/cadmus-profile-ui';
import { CadmusShopAssetService } from '@myrmidon/cadmus-shop-asset';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-facet-list-code-page',
  templateUrl: './facet-list-code-page.component.html',
  styleUrls: ['./facet-list-code-page.component.scss'],
})
export class FacetListCodePageComponent {
  public data$: Observable<FacetDefinition[]>;

  constructor(
    facetListQuery: FacetListQuery,
    private _facetListService: FacetListService,
    private _partService: PartDefinitionVmService,
    private _shopService: CadmusShopAssetService,
    private _snackbar: MatSnackBar,
    private _router: Router
  ) {
    this.data$ = facetListQuery.selectAll().pipe(
      map((facets) => {
        return facets.map((gf) => {
          return {
            id: gf.id,
            label: gf.label,
            colorKey: gf.colorKey || '',
            description: gf.description,
            partDefinitions: this._partService.getPartDefsFromGroup(
              gf
            ),
          };
        });
      })
    );
  }

  public loadSample(): void {
    this._shopService
      .loadObject<FacetDefinition[]>('samples/facets')
      .pipe(take(1))
      .subscribe((facets) => {
        this._facetListService.set(facets);
      });
  }

  public onDataChange(data: FacetDefinition[]): void {
    this._facetListService.set(data);
    this._snackbar.open('Facets saved', 'OK', {
      duration: 1500,
    });
    this._router.navigate(['/profile/flow'], { queryParams: { step: 1 } });
  }
}
