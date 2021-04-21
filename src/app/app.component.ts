import { Component } from '@angular/core';
import { TourService } from 'ngx-ui-tour-md-menu';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(tourService: TourService) {
    tourService.initialize([
      {
        anchorId: 'profile-flow.facets',
        title: '1. Shape your data',
        content:
          'Start here by defining which data models you want to compose into one or more items.',
      },
      {
        anchorId: 'profile-flow.flags',
        title: '2. Optionally define some flags',
        content:
          'You can define a number of flags to attach to your data records, with various editorial meaning; like e.g. "has issues", "revised", etc.',
      },
      {
        anchorId: 'profile-flow.thesauri',
        title: '3. Define some taxonomies',
        content:
          'Define any number of taxonomies, in a flat (list) or hierarchical (tree) form, you want to use in editing your data, so users can pick values from a predefined set rather than freely typing them.',
      },
    ]);
  }
}
