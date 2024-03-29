import { Component, OnInit } from '@angular/core';
import { TextToFileService } from '@myrmidon/cadmus-profile-core';
import {
  CadmusProfile,
  FacetListRepository,
  FlagListRepository,
  ProfileBuilderService,
  RamThesaurusService,
} from '@myrmidon/cadmus-profile-ui';

@Component({
  selector: 'app-profile-code-page',
  templateUrl: './profile-code-page.component.html',
  styleUrls: ['./profile-code-page.component.scss'],
})
export class ProfileCodePageComponent implements OnInit {
  public profile: CadmusProfile | undefined;

  constructor(
    private _facetRepository: FacetListRepository,
    private _flagRepository: FlagListRepository,
    private _thesService: RamThesaurusService,
    private _builderService: ProfileBuilderService,
    private _textToFileService: TextToFileService
  ) {}

  ngOnInit(): void {
    this.profile = this._builderService.build(
      this._facetRepository.getFacets(),
      this._flagRepository.getFlags(),
      this._thesService.getAll()
    );
  }

  public onDataChange(data: any): void {
    const json = JSON.stringify(data || {}, null, 2);
    const now = new Date();
    const name =
      `profile-` +
      `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}` +
      `_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}.json`;
    this._textToFileService.saveToFile(json, name, 'text/json');
  }
}
