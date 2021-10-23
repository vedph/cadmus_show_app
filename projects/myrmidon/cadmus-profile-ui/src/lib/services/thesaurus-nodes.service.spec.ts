import { TestBed } from '@angular/core/testing';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';

import { ThesaurusNodesService } from './thesaurus-nodes.service';

fdescribe('ThesaurusNodesService', () => {
  let service: ThesaurusNodesService;
  let flatEntries: ThesaurusEntry[] = [
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

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThesaurusNodesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should import flat set', () => {
    service.importEntries(flatEntries);
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
    service.importEntries(flatEntries);
    expect(service.getParentIds().length).toBe(0);
  });

  it('should not move 1st entry up in flat set', () => {
    service.importEntries(flatEntries);
    service.moveUp('r');
    const nodes = service.getNodes();
    expect(nodes[0].id).toBe('r');
    expect(nodes[1].id).toBe('g');
    expect(nodes[2].id).toBe('b');
  });

  it('should not move last entry down in flat set', () => {
    service.importEntries(flatEntries);
    service.moveDown('b');
    const nodes = service.getNodes();
    expect(nodes[0].id).toBe('r');
    expect(nodes[1].id).toBe('g');
    expect(nodes[2].id).toBe('b');
  });

  it('should move 2nd entry up in flat set', () => {
    service.importEntries(flatEntries);
    service.moveUp('g');
    const nodes = service.getNodes();
    expect(nodes[0].id).toBe('g');
    expect(nodes[1].id).toBe('r');
    expect(nodes[2].id).toBe('b');
  });

  it('should move 2nd entry down in flat set', () => {
    service.importEntries(flatEntries);
    service.moveDown('g');
    const nodes = service.getNodes();
    expect(nodes[0].id).toBe('r');
    expect(nodes[1].id).toBe('b');
    expect(nodes[2].id).toBe('g');
  });

  it('should delete 1st entry in flat set', () => {
    service.importEntries(flatEntries);
    service.delete('r');
    const nodes = service.getNodes();
    expect(nodes.length).toBe(2);
    expect(nodes[0].id).toBe('g');
    expect(nodes[1].id).toBe('b');
  });

  it('should delete 2nd entry in flat set', () => {
    service.importEntries(flatEntries);
    service.delete('g');
    const nodes = service.getNodes();
    expect(nodes.length).toBe(2);
    expect(nodes[0].id).toBe('r');
    expect(nodes[1].id).toBe('b');
  });

  it('should delete last entry in flat set', () => {
    service.importEntries(flatEntries);
    service.delete('b');
    const nodes = service.getNodes();
    expect(nodes.length).toBe(2);
    expect(nodes[0].id).toBe('r');
    expect(nodes[1].id).toBe('g');
  });

  it('should replace 1st entry in flat set', () => {
    service.importEntries(flatEntries);
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
    expect(nodes[1].id).toBe('g');
    expect(nodes[2].id).toBe('b');
  });

  it('should replace mid entry in flat set', () => {
    service.importEntries(flatEntries);
    service.add({
      id: 'g',
      value: 'GREEN',
      ordinal: 2,
      level: 1,
    });
    const nodes = service.getNodes();
    expect(nodes.length).toBe(3);
    expect(nodes[0].id).toBe('r');
    expect(nodes[1].id).toBe('g');
    expect(nodes[1].value).toBe('GREEN');
    expect(nodes[2].id).toBe('b');
  });

  it('should replace last entry in flat set', () => {
    service.importEntries(flatEntries);
    service.add({
      id: 'b',
      value: 'BLUE',
      ordinal: 3,
      level: 1,
    });
    const nodes = service.getNodes();
    expect(nodes.length).toBe(3);
    expect(nodes[0].id).toBe('r');
    expect(nodes[1].id).toBe('g');
    expect(nodes[2].id).toBe('b');
    expect(nodes[2].value).toBe('BLUE');
  });
});
