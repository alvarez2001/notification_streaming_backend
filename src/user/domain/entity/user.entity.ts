import { Oauth2credential } from 'src/oauth2credential/domain/entity/oauth2credential.entity';
import { StreamingNotification } from 'src/streamingnotification/domain/entity/streamingnotification.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('increment')
    public id: number;

    @Column({ name: 'email' })
    public email: string;

    @Column({ unique: true, name: 'username' })
    public username: string;

    @Column({ name: 'password' })
    public password: string;

    @OneToMany(() => Oauth2credential, (oauth2Credential) => oauth2Credential.user)
    public oauth2Credentials: Oauth2credential[];

    @OneToMany(() => StreamingNotification, (streamingNotification) => streamingNotification.user)
    public streamingNotification: StreamingNotification[]

    @CreateDateColumn({ name: 'created_at' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    public updatedAt: Date;
}
