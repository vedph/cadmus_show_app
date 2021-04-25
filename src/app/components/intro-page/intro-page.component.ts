import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PhysicalDimension, PhysicalSize, ThesaurusEntry } from '@myrmidon/cadmus-core';

@Component({
  selector: 'app-intro-page',
  templateUrl: './intro-page.component.html',
  styleUrls: ['./intro-page.component.css'],
})
export class IntroPageComponent implements OnInit {
  public initialSize: PhysicalSize;
  public size: FormControl;
  public user: FormControl;
  public form: FormGroup;
  public rdf: string | undefined;
  public unitEntries: ThesaurusEntry[];

  constructor(formBuilder: FormBuilder) {
    this.unitEntries = [
      { id: 'mm', value: 'mm' },
      { id: 'cm', value: 'cm' },
      { id: 'mt', value: 'mt' },
    ];
    this.initialSize = {
      w: {
        value: 21,
        unit: 'cm',
      },
      h: {
        value: 29.7,
        unit: 'cm',
      },
      d: {
        value: 1,
        unit: 'mm'
      }
    };
    this.size = formBuilder.control(this.initialSize);
    this.user = formBuilder.control('John Smith');
    this.form = formBuilder.group({
      size: this.size,
      user: this.user,
    });
  }

  ngOnInit(): void {}

  public onSizeChange(size: PhysicalSize): void {
    this.size.setValue(size);
  }

  private buildRdfDimension(
    type: string,
    d: PhysicalDimension
  ): string {
    // <MySize_Width> P2_has_type E54_Dimension;
    //   P90_has_value "...";
    //   P91_has_unit "...";
    //   P2_has_type "width".
    const sb: string[] = [];
    const uri = `my:MySize_${type}`;
    sb.push(`# dimension ${type}:\n`);
    sb.push(`${uri} crm:P2_has_type crm:E54_Dimension;\n`);
    sb.push(`  crm:P90_has_value ${d.value};\n`);
    sb.push(`  crm:P91_has_unit "${d.unit}";\n`);
    sb.push(`  crm:P2_has_type "${type.toLowerCase()}".\n`);
    return sb.join('');
  }

  public buildRdf(): void {
    const sb: string[] = [];
    if (!this.size.value.w && !this.size.value.h && !this.size.value.d) {
      return;
    }

    // preamble
    sb.push('@PREFIX my: <http://www.my-stuff.org/>.\n');
    sb.push('@PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>.\n');

    // <MyObject> P2_has_type E19_Physical_Object.
    sb.push('\n# the object measured is a physical object:\n');
    sb.push('my:MyObject crm:P2_has_type crm:E19_Physical_Object.\n');

    // dimensions...
    sb.push('\n# the measurement dimensions:\n');
    if (this.size.value.w) {
      sb.push(this.buildRdfDimension('Width', this.size.value.w));
      sb.push('\n');
    }
    if (this.size.value.h) {
      sb.push(this.buildRdfDimension('Height', this.size.value.h));
      sb.push('\n');
    }
    if (this.size.value.d) {
      sb.push(this.buildRdfDimension('Depth', this.size.value.d));
      sb.push('\n');
    }

    // <MyMeasurement> P2_has_type E16_Measurement;
    //   P40_observed_dimension <MySize_W...>; ...
    //   P39_measured <MyObject>.
    sb.push('# the measurement event:\n');
    sb.push('my:MyMeasurement crm:P2_has_type crm:E16_Measurement;\n');
    if (this.size.value.w) {
      sb.push(`  crm:P40_observed_dimension my:MySize_Width;\n`);
    }
    if (this.size.value.h) {
      sb.push(`  crm:P40_observed_dimension my:MySize_Height;\n`);
    }
    if (this.size.value.d) {
      sb.push(`  crm:P40_observed_dimension my:MySize_Depth;\n`);
    }
    sb.push('  crm:P39_measured my:MyObject.\n');

    // <MyObject> P43_has_dimension <MyMeasurement>.
    sb.push('\n# the object has the measured dimension:\n');
    sb.push('my:MyObject P43_has_dimension my:MyMeasurement.\n');

    // if user:
    // <You> P2_has_type E21_Person.
    // <MyMeasurement> P141_assigned <You>;
    //   P7_took_place_at "...".
    const user = this.user.value.replace(new RegExp('\\s+', 'g'), '');
    if (user) {
      sb.push(`\n# you (${this.user.value}) are a person:\n`);
      sb.push(`my:${user} crm:P2_has_type crm:E21_Person.\n`);

      const now = new Date();
      const nowText = now.getUTCFullYear() + '-' +
        (now.getUTCMonth() + 1).toString().padStart(2, '0') + '-' +
        (now.getUTCDate()).toString().padStart(2, '0') + 'T' +
        (now.getUTCHours()).toString().padStart(2, '0') + ':' +
        (now.getUTCMinutes()).toString().padStart(2, '0') + ':' +
        (now.getUTCSeconds()).toString().padStart(2, '0');

      sb.push('\n# and the measurement was taken by you:\n');
      sb.push(`my:MyMeasurement crm:P141_assigned my:${user};\n`);
      sb.push(`  crm:P7_took_place_at "${nowText}".`);
    }

    this.rdf = sb.join('');
  }
}
