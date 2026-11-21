import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { builtProjects } from '../../src/world-forge/content/projects.ts';
import { PLINTH, PLINTH_SITES } from '../../src/world-forge/regions/forge/hubLayout.ts';
import { buildTerrace, EMBLEM_BASE, MONUMENT_BUDGET, triangleCount } from '../../src/world-forge/regions/forge/monumentGeometry.ts';

describe('the Forged Works geometry (M5.8 render budget)', () => {
  const projects = builtProjects();
  const terrace = buildTerrace(projects);

  it('bakes all eight monuments into two meshes within the triangle budget', () => {
    const triangles = triangleCount(terrace.stone) + triangleCount(terrace.edges);
    assert.ok(triangles <= MONUMENT_BUDGET.triangles, `${triangles} triangles (budget ${MONUMENT_BUDGET.triangles})`);
    // Stone + edges, plus at most one light thread while selected: well under the draw-call budget.
    assert.ok(3 <= MONUMENT_BUDGET.drawCalls);
  });

  it('gives every monument its own contiguous range of edge vertices, covering the mesh exactly', () => {
    assert.deepEqual(terrace.monuments.map((m) => m.id), projects.map((p) => p.id));
    let next = 0;
    for (const m of terrace.monuments) {
      assert.equal(m.edges.start, next, `${m.id} starts where the previous ends`);
      assert.ok(m.edges.count > 0, `${m.id} has glowing edges`);
      next += m.edges.count;
    }
    assert.equal(next, terrace.edges.getAttribute('position').count);
    assert.equal(terrace.edges.getAttribute('color').count, next, 'one colour per edge vertex');
  });

  it('stands each monument on its own plinth, emblem above the stele and under 11 units', () => {
    for (const m of terrace.monuments) {
      const project = projects.find((p) => p.id === m.id)!;
      const site = PLINTH_SITES[project.plinth];
      assert.deepEqual(m.base, [site.position[0], site.position[1] + PLINTH.size[1], site.position[2]]);
      assert.ok(m.top > EMBLEM_BASE && m.top < 11, `${m.id} top ${m.top.toFixed(2)}`);
    }
  });

  it('keeps each monument\'s edges near its own plinth (the merge placed them in world space)', () => {
    const position = terrace.edges.getAttribute('position');
    for (const m of terrace.monuments) {
      for (let v = m.edges.start; v < m.edges.start + m.edges.count; v += 7) {
        const d = Math.hypot(position.getX(v) - m.base[0], position.getZ(v) - m.base[2]);
        assert.ok(d < 2.5, `${m.id} vertex ${v} is ${d.toFixed(2)} from its plinth`);
      }
    }
  });
});
