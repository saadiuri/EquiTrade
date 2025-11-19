import { ChildEntity } from 'typeorm';
import { User } from './User';

@ChildEntity()
export class Comprador extends User {}
