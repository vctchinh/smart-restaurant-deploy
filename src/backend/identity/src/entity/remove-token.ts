import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class RemoveToken {
	@PrimaryColumn()
	token: string;

	@Column({ nullable: false, type: 'timestamp' })
	expiryDate: Date;
}
