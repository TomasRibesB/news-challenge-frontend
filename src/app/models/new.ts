export class New {
  id!: number;
  title!: string;
  body!: string;
  imageUrl!: string;
  author!: string;
  date!: Date;

  constructor(init?: Partial<New>) {
    Object.assign(this, init);
  }
}

