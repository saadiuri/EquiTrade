import { ChildEntity, Column } from 'typeorm';
import { User } from './User';

@ChildEntity()
export class Vendedor extends User {
  @Column({ type: 'float', default: 0.0 })
  nota!: number;
}
