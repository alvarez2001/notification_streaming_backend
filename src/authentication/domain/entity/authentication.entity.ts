import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../../user/domain/entity/user.entity';

@Entity()
export class Authentication {
    @PrimaryGeneratedColumn('increment')
    public id: number;

    @Column({ name: 'token' })
    public token: string;

    @Column({ name: 'expire_in' })
    public expireIn: string;

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    public user: User;

    @CreateDateColumn({ name: 'created_at' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    public updatedAt: Date;
}
