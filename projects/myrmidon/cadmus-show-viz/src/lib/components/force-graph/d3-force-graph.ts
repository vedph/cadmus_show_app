import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import { SimulationNodeDatum } from 'd3-force';
import { SimulationLinkDatum } from 'd3';

export interface GraphNode extends SimulationNodeDatum {
  id?: string;
  label?: string;
}

export interface GraphLink extends SimulationLinkDatum<GraphNode> {
  label?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

/**
 * Graph options.
 */
export interface ForceGraphOptions {
  svgId: string;
  width: number;
  height: number;
  nodeRadius: number;
  distance: number;
  initialZoom?: number;
  nodeClick?: (node: GraphNode) => void;
}

export const DEFAULT_FORCE_GRAPH_OPTIONS: ForceGraphOptions = {
  svgId: 'force-graph',
  width: 400,
  height: 400,
  nodeRadius: 10,
  distance: 30,
};

export class D3ForceGraph {
  private _simulation: d3.Simulation<GraphNode, GraphLink> | undefined;

  constructor(private _options: ForceGraphOptions, data?: GraphData) {
    this._options = Object.assign(
      {},
      DEFAULT_FORCE_GRAPH_OPTIONS,
      this._options
    );
    this.setData(data);
  }

  private init(data: GraphData): void {
    // https://stackoverflow.com/questions/38391411/what-is-the-d3-js-v4-0-equivalent-for-d3-scale-category10
    const color = d3Scale.scaleOrdinal(d3.schemeCategory10);
    const self = this;

    // setup the force layout
    // https://forum.freecodecamp.org/t/trouble-converting-this-d3-to-version-4/46618
    this._simulation = d3
      .forceSimulation(data.nodes)
      .force('charge', d3.forceManyBody())
      .force(
        'link',
        d3
          .forceLink(data.links)
          .id((d: GraphNode) => d.id || '')
          .distance(this._options.distance)
      )
      .force(
        'center',
        d3.forceCenter(this._options.width / 2, this._options.height / 2)
      );

    // select the SVG container element, remove its content, and set its size
    const svg = d3.select('#' + this._options.svgId);
    svg.selectAll('*').remove();
    svg.attr('width', this._options.width).attr('height', this._options.height);

    // this child of svg will hold the whole content (required for zoom)
    const g = svg.append('g');

    // add g @class=links with a line for each link
    const link = g
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(data.links)
      .enter()
      .append('line')
      .style('stroke-width', (d) => 2);

    // add g @class=nodes with a g for each node
    const node = g
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(data.nodes)
      .enter()
      .append('g');

    // add a draggable circle in each of these g nodes
    node
      .append('circle')
      .attr('r', this._options.nodeRadius)
      .attr('fill', (d: GraphNode) => {
        return color(d.id || '');
      })
      // .classed('pinned', (d) => {
      //   return d.fx ? true : false;
      // })
      .call(
        d3
          .drag<SVGCircleElement, GraphNode>()
          .on('start', this.onDragStart)
          .on('drag', this.onDragDrag)
          .on('end', function (e, d) {
            self.onDragEnd(self, e, d, this);
          })
      );

    // add a label to each of these g nodes
    node
      .append('text')
      .text((d: any) => {
        return d.label;
      })
      .attr('x', 6)
      .attr('y', 3);

    // add a title to each of these g nodes
    node.append('title').text((d: any) => {
      return d.id;
    });

    // handle click on node
    // node.on('click', (event: any, node: GraphNode) => {
    node.on('click', function (e, d) {
      self.onNodeClick(self, e, d, this);
    });

    // set nodes and handle ticks to position them
    this._simulation.nodes(data.nodes).on('tick', () => {
      link
        .attr('x1', (d: GraphLink) => {
          return (d.source as GraphNode).x || 0;
        })
        .attr('y1', (d: GraphLink) => (d.source as GraphNode).y || 0)
        .attr('x2', (d: GraphLink) => (d.target as GraphNode).x || 0)
        .attr('y2', (d: GraphLink) => (d.target as GraphNode).y || 0);
      node.attr('transform', (d) => {
        return 'translate(' + d.x + ',' + d.y + ')';
      });
    });

    // zoom behavior for g
    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 10])
      .on('zoom', (event: any) => {
        // svg.attr('transform', event.transform);
        const value = this.calcZoom(event.transform);
        g.attr('transform', value);
      });

    // apply the zoom behavior on the svg element
    (svg as any).call(zoom);

    // set initial zoom if any
    if (this._options.initialZoom) {
      const value = this.calcZoom({
        x: 0,
        y: 0,
        k: this._options.initialZoom,
      });
      g.attr('transform', value);
    }

    this._simulation.alphaTarget(0.3).restart();
  }

  private calcZoom(transform: { x: number; y: number; k: number }): string {
    // https://stackoverflow.com/questions/55987499/prevent-panning-outside-of-map-bounds-in-d3v5
    const tx = Math.min(
      0,
      Math.max(
        transform.x,
        this._options.width - this._options.width * transform.k
      )
    );
    const ty = Math.min(
      0,
      Math.max(
        transform.y,
        this._options.height - this._options.height * transform.k
      )
    );
    return [
      'translate(' + [tx, ty] + ')',
      'scale(' + (transform.k || 1) + ')',
    ].join(' ');
  }

  private onDragStart(event: any, d: GraphNode): void {
    // if (!event.active) this._simulation?.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  private onDragDrag(event: any, d: GraphNode): void {
    d.fx = event.x;
    d.fy = event.y;
  }

  private onDragEnd(
    self: D3ForceGraph,
    event: any,
    d: GraphNode,
    element: Element
  ): void {
    // if (!event.active) this._simulation?.alphaTarget(0);
    if (event.sourceEvent.shiftKey) {
      // pin
      d.fx = d.x;
      d.fy = d.y;
      d3.select(element).attr('class', 'pinned');
    } else {
      d.fx = null;
      d.fy = null;
    }
  }

  private onNodeClick(
    self: D3ForceGraph,
    event: any,
    node: GraphNode,
    element: Element
  ): void {
    // unpin node if shift-click
    if (event.ctrlKey) {
      node.fx = null;
      node.fy = null;
      d3.select(element).select('circle').attr('class', null);
    } else {
      // emit event if requested
      if (self._options.nodeClick) {
        self._options.nodeClick(node);
      }
    }
  }

  public setData(data?: GraphData): void {
    this.init(
      data || {
        nodes: [],
        links: [],
      }
    );
  }

  public stop(): void {
    this._simulation?.stop();
  }

  public start(): void {
    this._simulation?.restart();
  }
}
