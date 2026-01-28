import { fluidState } from "./state";
import { programs } from "./programs";
import { settings } from "./settings";

export function stepSimulation(passEncoder) {
  // Add velocity and dye at the mouse position
  programs.updateDye.dispatch(passEncoder);
  programs.update.dispatch(passEncoder);

  // Advect the velocity field through itself
  programs.advect.dispatch(passEncoder);
  programs.boundary.dispatch(passEncoder); // boundary conditions

  // Compute the divergence
  programs.divergence.dispatch(passEncoder);
  programs.boundaryDiv.dispatch(passEncoder); // boundary conditions

  // Solve the jacobi-pressure equation
  for (let i = 0; i < settings.pressure_iterations; i++) {
    programs.pressure.dispatch(passEncoder);
    programs.boundaryPressure.dispatch(passEncoder); // boundary conditions
  }

  // Subtract the pressure from the velocity field
  programs.gradientSubtract.dispatch(passEncoder);
  programs.clearPressure.dispatch(passEncoder);

  // Compute & apply vorticity conifnment
  programs.vorticity.dispatch(passEncoder);
  programs.vorticityConfinment.dispatch(passEncoder);

  // Advect the dye through the velocity field
  programs.advectDye.dispatch(passEncoder);
}
