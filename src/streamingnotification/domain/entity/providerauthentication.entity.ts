import { Oauth2credential } from 'src/oauth2credential/domain/entity/oauth2credential.entity';
import { User } from 'src/user/domain/entity/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    ManyToMany,
    JoinTable,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

export enum StatusStreamingNotification {
    filled = 'filled',
    withoutAuthorization = 'without_authorization',
    inProgress = 'in_progress',
    refused = 'refused',
}

@Entity()
export class ProviderAuthentication {
    @PrimaryGeneratedColumn('increment')
    public id: number;

    @Column({ name: 'name', unique: true })
    public name: string;

    @Column({ name: 'access_token', nullable: true })
    public accessToken: string;

    @Column({ name: 'refresh_token', nullable: true })
    public refreshToken: string;
  
    @Column({ name: 'token_expiry', nullable: true })
    public tokenExpiry: number;
  
    @Column({ name: 'date_expiry', nullable: true })
    public dateExpiry: Date;
  
    @Column({ name: 'scope', nullable: true })
    public scope: string;

    @CreateDateColumn({ name: 'created_at' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    public updatedAt: Date;
}
