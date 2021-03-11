import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ComponentSignal } from 'projects/myrmidon/cadmus-profile-core/src/public-api';
import { ThesaurusNode } from '../../services/thesaurus-nodes.service';

/**
 * A single thesaurus node used to display and edit a thesaurus entry.
 */
@Component({
  selector: 'cadmus-thesaurus-node',
  templateUrl: './thesaurus-node.component.html',
  styleUrls: ['./thesaurus-node.component.css'],
})
export class ThesaurusNodeComponent implements OnInit {
  private _node: ThesaurusNode | undefined;
  public editing: boolean;

  public id: FormControl;
  public value: FormControl;
  public form: FormGroup;

  @ViewChild('nodeVal') nodeValRef: ElementRef | undefined;

  @Input()
  public get node(): ThesaurusNode | undefined {
    return this._node;
  }
  public set node(value: ThesaurusNode | undefined) {
    this._node = value;
    this.updateForm(value);
  }

  @Output()
  public nodeChange: EventEmitter<ThesaurusNode>;

  @Output()
  public signal: EventEmitter<ComponentSignal<ThesaurusNode>>;

  constructor(formBuilder: FormBuilder) {
    this.editing = false;
    this.nodeChange = new EventEmitter<ThesaurusNode>();
    this.signal = new EventEmitter<ComponentSignal<ThesaurusNode>>();
    // form
    this.id = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
      Validators.pattern(/^[a-zA-Z0-9][-_a-zA-Z0-9]*$/),
    ]);
    this.value = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(200),
    ]);
    this.form = formBuilder.group({
      id: this.id,
      value: this.value,
    });
  }

  ngOnInit(): void {}

  private updateForm(node: ThesaurusNode | undefined): void {
    this.editing = false;
    if (!node) {
      this.form.reset();
      return;
    }
    this.id.setValue(node.id);
    this.value.setValue(node.value);
  }

  public toggleEdit(on: boolean): void {
    this.editing = on;
    if (on) {
      setTimeout(() => {
        this.nodeValRef?.nativeElement.focus();
      }, 300);
    }
  }

  private getNode(): ThesaurusNode {
    return {
      ...this._node,
      id: this.id.value.trim(),
      value: this.value.value.trim(),
      level: 0,
      ordinal: 0,
    };
  }

  public save(): void {
    if (!this.editing || this.form.invalid) {
      return;
    }
    this.form.markAsPristine();
    this.editing = false;
    this.nodeChange.emit(this.getNode());
  }

  public emitSignal(id: string) {
    this.signal.emit({
      id: id,
      payload: this.getNode(),
    });
  }
}
