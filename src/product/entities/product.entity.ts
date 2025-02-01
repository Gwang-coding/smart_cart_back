import { ViewEntity, PrimaryColumn, Column } from 'typeorm';

@ViewEntity({ name: 'products' }) // 데이터베이스에 있는 'users' 뷰를 매핑
export class Product {
  @PrimaryColumn()
  id: number;

  @Column()
  barcode: string;

  @Column()
  name: string;

  @Column()
  price: number;
}
