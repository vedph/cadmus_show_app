import { TestBed } from '@angular/core/testing';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';

import { ThesaurusNodesService } from './thesaurus-nodes.service';

function getFlatEntries(): ThesaurusEntry[] {
  return [
    {
      id: 'r',
      value: 'red',
    },
    {
      id: 'g',
      value: 'green',
    },
    {
      id: 'b',
      value: 'blue',
    },
  ];
}

function getTreeEntries(): ThesaurusEntry[] {
  return [
    {
      id: 'size',
      value: 'size',
    },
    {
      id: 'size.s',
      value: 'small',
    },
    {
      id: 'size.m',
      value: 'mid',
    },
    {
      id: 'size.l',
      value: 'large',
    },
    {
      id: 'color',
      value: 'color',
    },
    {
      id: 'color.r',
      value: 'red',
    },
    {
      id: 'color.g',
      value: 'green',
    },
    {
      id: 'color.b',
      value: 'blue',
    },
  ];
}

fdescribe('ThesaurusNodesService', () => {
  let service: ThesaurusNodesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThesaurusNodesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // #region flat set
  it('should import flat set', () => {
    service.importEntries(getFlatEntries());
    expect(service.length).toBe(3);
    const nodes = service.getNodes();
    // r
    let node = nodes[0];
    expect(node.id).toBe('r');
    expect(node.parentId).toBeFalsy();
    expect(node.hasChildren).toBeFalsy();
    expect(node.ordinal).toBe(1);
    expect(node.lastSibling).toBeFalsy();
    // g
    node = nodes[1];
    expect(node.id).toBe('g');
    expect(node.parentId).toBeFalsy();
    expect(node.hasChildren).toBeFalsy();
    expect(node.ordinal).toBe(2);
    expect(node.lastSibling).toBeFalsy();
    // b
    node = nodes[2];
    expect(node.id).toBe('b');
    expect(node.parentId).toBeFalsy();
    expect(node.hasChildren).toBeFalsy();
    expect(node.ordinal).toBe(3);
    expect(node.lastSibling).toBeTrue();
  });

  it('should have getParentIds empty for flat set', () => {
    service.importEntries(getFlatEntries());
    expect(service.getParentIds().length).toBe(0);
  });

  it('should not move 1st entry up in flat set', () => {
    service.importEntries(getFlatEntries());
    service.moveUp('r');
    const nodes = service.getNodes();
    expect(nodes[0].id).toBe('r');
    expect(nodes[1].id).toBe('g');
    expect(nodes[2].id).toBe('b');
  });

  it('should not move last entry down in flat set', () => {
    service.importEntries(getFlatEntries());
    service.moveDown('b');
    const nodes = service.getNodes();
    expect(nodes[0].id).toBe('r');
    expect(nodes[1].id).toBe('g');
    expect(nodes[2].id).toBe('b');
  });

  it('should move 2nd entry up in flat set', () => {
    service.importEntries(getFlatEntries());
    service.moveUp('g');
    const nodes = service.getNodes();
    expect(nodes[0].id).toBe('g');
    expect(nodes[0].ordinal).toBe(1);
    expect(nodes[1].id).toBe('r');
    expect(nodes[1].ordinal).toBe(2);
    expect(nodes[2].id).toBe('b');
    expect(nodes[2].ordinal).toBe(3);
    expect(nodes[2].lastSibling).toBeTrue();
  });

  it('should move 2nd entry down in flat set', () => {
    service.importEntries(getFlatEntries());
    service.moveDown('g');
    const nodes = service.getNodes();
    expect(nodes[0].id).toBe('r');
    expect(nodes[0].ordinal).toBe(1);
    expect(nodes[1].id).toBe('b');
    expect(nodes[1].ordinal).toBe(2);
    expect(nodes[2].id).toBe('g');
    expect(nodes[2].ordinal).toBe(3);
    expect(nodes[2].lastSibling).toBeTrue();
  });

  it('should delete 1st entry in flat set', () => {
    service.importEntries(getFlatEntries());
    service.delete('r');
    const nodes = service.getNodes();
    expect(nodes.length).toBe(2);
    expect(nodes[0].id).toBe('g');
    expect(nodes[0].ordinal).toBe(1);
    expect(nodes[1].id).toBe('b');
    expect(nodes[1].ordinal).toBe(2);
    expect(nodes[1].lastSibling).toBeTrue();
  });

  it('should delete 2nd entry in flat set', () => {
    service.importEntries(getFlatEntries());
    service.delete('g');
    const nodes = service.getNodes();
    expect(nodes.length).toBe(2);
    expect(nodes[0].id).toBe('r');
    expect(nodes[0].ordinal).toBe(1);
    expect(nodes[1].id).toBe('b');
    expect(nodes[1].ordinal).toBe(2);
    expect(nodes[1].lastSibling).toBeTrue();
  });

  it('should delete last entry in flat set', () => {
    service.importEntries(getFlatEntries());
    service.delete('b');
    const nodes = service.getNodes();
    expect(nodes.length).toBe(2);
    expect(nodes[0].id).toBe('r');
    expect(nodes[0].ordinal).toBe(1);
    expect(nodes[1].id).toBe('g');
    expect(nodes[1].ordinal).toBe(2);
    expect(nodes[1].lastSibling).toBeTrue();
  });

  it('should replace 1st entry in flat set', () => {
    service.importEntries(getFlatEntries());
    service.add({
      id: 'r',
      value: 'RED',
      ordinal: 1,
      level: 1,
    });
    const nodes = service.getNodes();
    expect(nodes.length).toBe(3);
    expect(nodes[0].id).toBe('r');
    expect(nodes[0].value).toBe('RED');
    expect(nodes[0].ordinal).toBe(1);
    expect(nodes[1].id).toBe('g');
    expect(nodes[1].ordinal).toBe(2);
    expect(nodes[2].id).toBe('b');
    expect(nodes[2].ordinal).toBe(3);
    expect(nodes[2].lastSibling).toBeTrue();
  });

  it('should replace mid entry in flat set', () => {
    service.importEntries(getFlatEntries());
    service.add({
      id: 'g',
      value: 'GREEN',
      ordinal: 2,
      level: 1,
    });
    const nodes = service.getNodes();
    expect(nodes.length).toBe(3);
    expect(nodes[0].id).toBe('r');
    expect(nodes[0].ordinal).toBe(1);
    expect(nodes[1].id).toBe('g');
    expect(nodes[1].value).toBe('GREEN');
    expect(nodes[1].ordinal).toBe(2);
    expect(nodes[2].id).toBe('b');
    expect(nodes[2].ordinal).toBe(3);
    expect(nodes[2].lastSibling).toBeTrue();
  });

  it('should replace last entry in flat set', () => {
    service.importEntries(getFlatEntries());
    service.add({
      id: 'b',
      value: 'BLUE',
      ordinal: 3,
      level: 1,
    });
    const nodes = service.getNodes();
    expect(nodes.length).toBe(3);
    expect(nodes[0].id).toBe('r');
    expect(nodes[0].ordinal).toBe(1);
    expect(nodes[1].id).toBe('g');
    expect(nodes[1].ordinal).toBe(2);
    expect(nodes[2].id).toBe('b');
    expect(nodes[2].value).toBe('BLUE');
    expect(nodes[2].ordinal).toBe(3);
    expect(nodes[2].lastSibling).toBeTrue();
  });

  it('should add as 1st entry in flat set', () => {
    service.importEntries(getFlatEntries());
    service.add({
      id: 'w',
      value: 'white',
      ordinal: 1,
      level: 1,
    });
    const nodes = service.getNodes();
    expect(nodes.length).toBe(4);
    expect(nodes[0].id).toBe('w');
    expect(nodes[0].ordinal).toBe(1);
    expect(nodes[1].id).toBe('r');
    expect(nodes[1].ordinal).toBe(2);
    expect(nodes[2].id).toBe('g');
    expect(nodes[2].ordinal).toBe(3);
    expect(nodes[3].id).toBe('b');
    expect(nodes[3].ordinal).toBe(4);
    expect(nodes[3].lastSibling).toBeTrue();
  });

  it('should add as 2nd entry in flat set', () => {
    service.importEntries(getFlatEntries());
    service.add({
      id: 'w',
      value: 'white',
      ordinal: 2,
      level: 1,
    });
    const nodes = service.getNodes();
    expect(nodes.length).toBe(4);
    expect(nodes[0].id).toBe('r');
    expect(nodes[0].ordinal).toBe(1);
    expect(nodes[1].id).toBe('w');
    expect(nodes[1].ordinal).toBe(2);
    expect(nodes[2].id).toBe('g');
    expect(nodes[2].ordinal).toBe(3);
    expect(nodes[3].id).toBe('b');
    expect(nodes[3].ordinal).toBe(4);
    expect(nodes[3].lastSibling).toBeTrue();
  });

  it('should add as penultimate entry in flat set', () => {
    service.importEntries(getFlatEntries());
    service.add({
      id: 'w',
      value: 'white',
      ordinal: 3,
      level: 1,
    });
    const nodes = service.getNodes();
    expect(nodes.length).toBe(4);
    expect(nodes[0].id).toBe('r');
    expect(nodes[0].ordinal).toBe(1);
    expect(nodes[1].id).toBe('g');
    expect(nodes[1].ordinal).toBe(2);
    expect(nodes[2].id).toBe('w');
    expect(nodes[2].ordinal).toBe(3);
    expect(nodes[3].id).toBe('b');
    expect(nodes[3].ordinal).toBe(4);
    expect(nodes[3].lastSibling).toBeTrue();
  });

  it('should add as last entry in flat set', () => {
    service.importEntries(getFlatEntries());
    service.add({
      id: 'w',
      value: 'white',
      ordinal: 4,
      level: 1,
    });
    const nodes = service.getNodes();
    expect(nodes.length).toBe(4);
    expect(nodes[0].id).toBe('r');
    expect(nodes[0].ordinal).toBe(1);
    expect(nodes[1].id).toBe('g');
    expect(nodes[1].ordinal).toBe(2);
    expect(nodes[2].id).toBe('b');
    expect(nodes[2].ordinal).toBe(3);
    expect(nodes[3].id).toBe('w');
    expect(nodes[3].ordinal).toBe(4);
    expect(nodes[3].lastSibling).toBeTrue();
  });
  //#endregion

  // #region tree set
  it('should import tree set', () => {
    service.importEntries(getTreeEntries());
    const nodes = service.getNodes();
    expect(nodes.length).toBe(8);
    // size
    let node = nodes[0];
    expect(node.id).toBe('size');
    expect(node.parentId).toBeFalsy();
    expect(node.hasChildren).toBeTrue();
    expect(node.ordinal).toBe(1);
    expect(node.lastSibling).toBeFalsy();
    // size.s
    node = nodes[1];
    expect(node.id).toBe('size.s');
    expect(node.parentId).toBe('size');
    expect(node.hasChildren).toBeFalsy();
    expect(node.ordinal).toBe(1);
    expect(node.lastSibling).toBeFalsy();
    // size.m
    node = nodes[2];
    expect(node.id).toBe('size.m');
    expect(node.parentId).toBe('size');
    expect(node.hasChildren).toBeFalsy();
    expect(node.ordinal).toBe(2);
    expect(node.lastSibling).toBeFalsy();
    // size.l
    node = nodes[3];
    expect(node.id).toBe('size.l');
    expect(node.parentId).toBe('size');
    expect(node.hasChildren).toBeFalsy();
    expect(node.ordinal).toBe(3);
    expect(node.lastSibling).toBeTrue();
    // color
    node = nodes[4];
    expect(node.id).toBe('color');
    expect(node.parentId).toBeFalsy();
    expect(node.hasChildren).toBeTrue();
    expect(node.ordinal).toBe(2);
    expect(node.lastSibling).toBeTrue();
    // color.r
    node = nodes[5];
    expect(node.id).toBe('color.r');
    expect(node.parentId).toBe('color');
    expect(node.hasChildren).toBeFalsy();
    expect(node.ordinal).toBe(1);
    expect(node.lastSibling).toBeFalsy();
    // color.g
    node = nodes[6];
    expect(node.id).toBe('color.g');
    expect(node.parentId).toBe('color');
    expect(node.hasChildren).toBeFalsy();
    expect(node.ordinal).toBe(2);
    expect(node.lastSibling).toBeFalsy();
    // color.b
    node = nodes[7];
    expect(node.id).toBe('color.b');
    expect(node.parentId).toBe('color');
    expect(node.hasChildren).toBeFalsy();
    expect(node.ordinal).toBe(3);
    expect(node.lastSibling).toBeTrue();
  });

  it('should have getParentIds for tree set', () => {
    service.importEntries(getTreeEntries());
    const entries = service.getParentIds();
    expect(entries.length).toBe(2);
    expect(entries[0].id).toBe('size');
    expect(entries[1].id).toBe('color');
  });

  it('should not move 1st entry up in tree set', () => {
    service.importEntries(getTreeEntries());
    service.moveUp('color.r');
    const nodes = service.getNodes();
    expect(nodes[5].id).toBe('color.r');
    expect(nodes[6].id).toBe('color.g');
    expect(nodes[7].id).toBe('color.b');
    expect(nodes[7].lastSibling).toBeTrue();
  });

  it('should not move last entry down in tree set', () => {
    service.importEntries(getTreeEntries());
    service.moveDown('size.l');
    const nodes = service.getNodes();
    expect(nodes[1].id).toBe('size.s');
    expect(nodes[2].id).toBe('size.m');
    expect(nodes[3].id).toBe('size.l');
    expect(nodes[3].lastSibling).toBeTrue();
  });

  it('should move 2nd entry up in tree set', () => {
    service.importEntries(getTreeEntries());
    service.moveUp('color.g');
    const nodes = service.getNodes();
    expect(nodes[5].id).toBe('color.g');
    expect(nodes[5].ordinal).toBe(1);
    expect(nodes[6].id).toBe('color.r');
    expect(nodes[6].ordinal).toBe(2);
    expect(nodes[7].id).toBe('color.b');
    expect(nodes[7].ordinal).toBe(3);
    expect(nodes[7].lastSibling).toBeTrue();
  });

  it('should move 2nd entry down in tree set', () => {
    service.importEntries(getTreeEntries());
    service.moveDown('color.g');
    const nodes = service.getNodes();
    expect(nodes[5].id).toBe('color.r');
    expect(nodes[5].ordinal).toBe(1);
    expect(nodes[6].id).toBe('color.b');
    expect(nodes[6].ordinal).toBe(2);
    expect(nodes[7].id).toBe('color.g');
    expect(nodes[7].ordinal).toBe(3);
    expect(nodes[7].lastSibling).toBeTrue();
  });

  it('should delete 1st entry in tree set', () => {
    service.importEntries(getTreeEntries());
    service.delete('color.r');
    const nodes = service.getNodes();
    expect(nodes.length).toBe(7);
    expect(nodes[5].id).toBe('color.g');
    expect(nodes[5].ordinal).toBe(1);
    expect(nodes[6].id).toBe('color.b');
    expect(nodes[6].ordinal).toBe(2);
    expect(nodes[6].lastSibling).toBeTrue();
  });

  it('should delete 2nd entry in tree set', () => {
    service.importEntries(getTreeEntries());
    service.delete('color.g');
    const nodes = service.getNodes();
    expect(nodes.length).toBe(7);
    expect(nodes[5].id).toBe('color.r');
    expect(nodes[5].ordinal).toBe(1);
    expect(nodes[6].id).toBe('color.b');
    expect(nodes[6].ordinal).toBe(2);
    expect(nodes[6].lastSibling).toBeTrue();
  });

  it('should delete last entry in tree set', () => {
    service.importEntries(getTreeEntries());
    service.delete('color.b');
    const nodes = service.getNodes();
    expect(nodes.length).toBe(7);
    expect(nodes[5].id).toBe('color.r');
    expect(nodes[5].ordinal).toBe(1);
    expect(nodes[6].id).toBe('color.g');
    expect(nodes[6].ordinal).toBe(2);
    expect(nodes[6].lastSibling).toBeTrue();
  });

  it('should replace 1st entry in tree set', () => {
    service.importEntries(getTreeEntries());
    service.add({
      id: 'color.r',
      value: 'RED',
      ordinal: 1,
      level: 2,
    });
    const nodes = service.getNodes();
    expect(nodes.length).toBe(8);
    expect(nodes[5].id).toBe('color.r');
    expect(nodes[5].value).toBe('RED');
    expect(nodes[5].ordinal).toBe(1);
    expect(nodes[6].id).toBe('color.g');
    expect(nodes[6].ordinal).toBe(2);
    expect(nodes[7].id).toBe('color.b');
    expect(nodes[7].ordinal).toBe(3);
    expect(nodes[7].lastSibling).toBeTrue();
  });

  it('should replace mid entry in tree set', () => {
    service.importEntries(getTreeEntries());
    service.add({
      id: 'color.g',
      value: 'GREEN',
      ordinal: 2,
      level: 2,
    });
    const nodes = service.getNodes();
    expect(nodes.length).toBe(8);
    expect(nodes[5].id).toBe('color.r');
    expect(nodes[5].ordinal).toBe(1);
    expect(nodes[6].id).toBe('color.g');
    expect(nodes[6].value).toBe('GREEN');
    expect(nodes[6].ordinal).toBe(2);
    expect(nodes[7].id).toBe('color.b');
    expect(nodes[7].ordinal).toBe(3);
    expect(nodes[7].lastSibling).toBeTrue();
  });

  it('should replace last entry in tree set', () => {
    service.importEntries(getTreeEntries());
    service.add({
      id: 'color.b',
      value: 'BLUE',
      ordinal: 3,
      level: 2,
    });
    const nodes = service.getNodes();
    expect(nodes.length).toBe(8);
    expect(nodes[5].id).toBe('color.r');
    expect(nodes[5].ordinal).toBe(1);
    expect(nodes[6].id).toBe('color.g');
    expect(nodes[6].ordinal).toBe(2);
    expect(nodes[7].id).toBe('color.b');
    expect(nodes[7].value).toBe('BLUE');
    expect(nodes[7].ordinal).toBe(3);
    expect(nodes[7].lastSibling).toBeTrue();
  });

  it('should add as 1st child entry in tree set', () => {
    service.importEntries(getTreeEntries());
    service.add({
      id: 'color.w',
      parentId: 'color',
      value: 'white',
      ordinal: 1,
      level: 2,
    });
    const nodes = service.getNodes();
    expect(nodes.length).toBe(9);
    expect(nodes[5].id).toBe('color.w');
    expect(nodes[5].ordinal).toBe(1);
    expect(nodes[6].id).toBe('color.r');
    expect(nodes[6].ordinal).toBe(2);
    expect(nodes[7].id).toBe('color.g');
    expect(nodes[7].ordinal).toBe(3);
    expect(nodes[8].id).toBe('color.b');
    expect(nodes[8].ordinal).toBe(4);
    expect(nodes[8].lastSibling).toBeTrue();
  });

  it('should add as 2nd child entry in tree set', () => {
    service.importEntries(getTreeEntries());
    service.add({
      id: 'color.w',
      parentId: 'color',
      value: 'white',
      ordinal: 2,
      level: 2,
    });
    const nodes = service.getNodes();
    expect(nodes.length).toBe(9);
    expect(nodes[5].id).toBe('color.r');
    expect(nodes[5].ordinal).toBe(1);
    expect(nodes[6].id).toBe('color.w');
    expect(nodes[6].ordinal).toBe(2);
    expect(nodes[7].id).toBe('color.g');
    expect(nodes[7].ordinal).toBe(3);
    expect(nodes[8].id).toBe('color.b');
    expect(nodes[8].ordinal).toBe(4);
    expect(nodes[8].lastSibling).toBeTrue();
  });

  it('should add as penultimate child entry in tree set', () => {
    service.importEntries(getTreeEntries());
    service.add({
      id: 'color.w',
      parentId: 'color',
      value: 'white',
      ordinal: 3,
      level: 2,
    });
    const nodes = service.getNodes();
    expect(nodes.length).toBe(9);
    expect(nodes[5].id).toBe('color.r');
    expect(nodes[5].ordinal).toBe(1);
    expect(nodes[6].id).toBe('color.g');
    expect(nodes[6].ordinal).toBe(2);
    expect(nodes[7].id).toBe('color.w');
    expect(nodes[7].ordinal).toBe(3);
    expect(nodes[7].lastSibling).toBeFalsy();
    expect(nodes[8].id).toBe('color.b');
    expect(nodes[8].ordinal).toBe(4);
    expect(nodes[8].lastSibling).toBeTrue();
  });

  it('should add as last child entry in tree set', () => {
    service.importEntries(getTreeEntries());
    service.add({
      id: 'color.w',
      parentId: 'color',
      value: 'white',
      ordinal: 4,
      level: 2,
    });
    const nodes = service.getNodes();
    expect(nodes.length).toBe(9);
    expect(nodes[5].id).toBe('color.r');
    expect(nodes[5].ordinal).toBe(1);
    expect(nodes[6].id).toBe('color.g');
    expect(nodes[6].ordinal).toBe(2);
    expect(nodes[7].id).toBe('color.b');
    expect(nodes[7].ordinal).toBe(3);
    expect(nodes[7].lastSibling).toBeFalsy();
    expect(nodes[8].id).toBe('color.w');
    expect(nodes[8].ordinal).toBe(4);
    expect(nodes[8].lastSibling).toBeTrue();
  });

  it('should add as 1st top sibling in tree set', () => {
    service.importEntries(getTreeEntries());
    service.add({
      id: 'shape',
      value: 'shape',
      ordinal: 1,
      level: 1,
    });
    const nodes = service.getNodes();
    expect(nodes.length).toBe(9);
    expect(nodes[0].id).toBe('shape');
    expect(nodes[0].ordinal).toBe(1);
    expect(nodes[1].id).toBe('size');
    expect(nodes[1].ordinal).toBe(2);
    expect(nodes[5].id).toBe('color');
    expect(nodes[5].ordinal).toBe(3);
  });

  it('should add as 2nd top sibling in tree set', () => {
    service.importEntries(getTreeEntries());
    service.add({
      id: 'shape',
      value: 'shape',
      ordinal: 2,
      level: 1,
    });
    const nodes = service.getNodes();
    expect(nodes.length).toBe(9);
    expect(nodes[0].id).toBe('size');
    expect(nodes[0].ordinal).toBe(1);
    expect(nodes[4].id).toBe('shape');
    expect(nodes[4].ordinal).toBe(2);
    expect(nodes[5].id).toBe('color');
    expect(nodes[5].ordinal).toBe(3);
  });
  //#endregion
});
