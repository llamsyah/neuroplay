import { Spherical, Vector3, MathUtils } from 'three';

/** Always test the nearest visible solid surface, including unsupported occluders. */
export function pickSupportedRegion(raycaster, meshes, mode) {
  const candidates = meshes.filter((mesh) => mesh.visible && mesh.material.opacity >= .5);
  const hit = raycaster.intersectObjects(candidates, false)[0];
  if (!hit) return null;
  const region = hit.object.userData.educationalRegion;
  if (!region || (region.kind === 'internal' && mode === 'whole')) return null;
  return { region, mesh: hit.object, point: hit.point };
}

/** Track the entire gesture path; a drag returning to its start is still a drag. */
export function createGestureGuard() {
  const pointers = new Map();
  return {
    get active() { return pointers.size > 0; },
    down(event) {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      const multi = pointers.size > 0;
      if (multi) for (const pointer of pointers.values()) pointer.multi = true;
      pointers.set(event.pointerId, { x:event.clientX, y:event.clientY, distance:0, multi, time:event.timeStamp, type:event.pointerType });
    },
    move(event) {
      const pointer = pointers.get(event.pointerId);
      if (pointer) pointer.distance = Math.max(pointer.distance, Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y));
    },
    up(event) {
      this.move(event);
      const pointer = pointers.get(event.pointerId);
      pointers.delete(event.pointerId);
      return Boolean(pointer && !pointer.multi && pointer.distance <= (pointer.type === 'touch' ? 9 : 5) && event.timeStamp - pointer.time < 900);
    },
    cancel() { pointers.clear(); },
  };
}

export function createSelectionHistory(limit = 24) {
  const stack = [];
  return {
    get length() { return stack.length; },
    push(snapshot) { if (snapshot?.id) { stack.push(structuredClone(snapshot)); if (stack.length > limit) stack.shift(); } },
    back() { return stack.pop() ?? null; },
    clear() { stack.length = 0; },
  };
}

/** Orbit around context; never interpolate a camera through the brain on a side switch. */
export function interpolateOrbit(start, end, progress) {
  if (progress >= 1) return { position:end.position.clone(), target:end.target.clone() };
  const from = new Spherical().setFromVector3(start.position.clone().sub(start.target));
  const to = new Spherical().setFromVector3(end.position.clone().sub(end.target));
  const deltaTheta = MathUtils.euclideanModulo(to.theta - from.theta + Math.PI, Math.PI * 2) - Math.PI;
  const spherical = new Spherical(
    MathUtils.lerp(from.radius, to.radius, progress),
    MathUtils.lerp(from.phi, to.phi, progress),
    from.theta + deltaTheta * progress,
  );
  const target = start.target.clone().lerp(end.target, progress);
  return { position:new Vector3().setFromSpherical(spherical).add(target), target };
}
