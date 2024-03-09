import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('increment')
    public id: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'last_name' })
    public lastName: string;

    @Column({ name: 'nationality' })
    public nationality: string;

    @Column({ name: 'identification' })
    public identification: string;

    @Column({ name: 'email' })
    public email: string;

    @Column({ unique: true, name: 'username' })
    public username: string;

    @Column({ name: 'password' })
    public password: string;

    @CreateDateColumn({ name: 'created_at' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    public updatedAt: Date;
}
