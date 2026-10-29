import u1 from './unit1.js'; import u2 from './unit2.js'; import u3 from './unit3.js';
import u4 from './unit4.js'; import u5 from './unit5.js'; import u6 from './unit6.js';
import u7 from './unit7.js'; import u8 from './unit8.js'; import u9 from './unit9.js';
export {rubricScoring} from './schema.js';
export const projects = [...u1,...u2,...u3,...u4,...u5,...u6,...u7,...u8,...u9];
export const projectByConcept = Object.fromEntries(projects.map(p=>[p.id,p]));
