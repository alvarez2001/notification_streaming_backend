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
export class StreamingNotification {
    @PrimaryGeneratedColumn('increment')
    public id: number;

    @Column({ name: 'name', unique: true })
    public name: string;

    @Column({ name: 'platform' })
    public platformStreaming: string;

    @JoinTable({
        joinColumn: { name: 'streaming_notification_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'oauth2_credential_id', referencedColumnName: 'id' },
    })
    @ManyToMany(() => Oauth2credential, oauth2Credential => oauth2Credential.streamingNotification)
    public platformNotifications: Oauth2credential[];

    @Column({ name: 'message' })
    public message: string;

    @Column({ name: 'user_id' })
    public userId: number;

    @ManyToOne(() => User, user => user.oauth2Credentials)
    @JoinColumn({ name: 'user_id' })
    public user: User;

    /**
     * Completado -> filled
     * Sin Autorizacion -> without_authorization
     * En Progreso -> in_progress
     * Rechazado -> refused
     */
    @Column({ name: 'status', default: StatusStreamingNotification.inProgress })
    public status: string;

    @Column({ name: 'broadcaster_user_id', nullable: true })
    public broadcasterUserId: number;

    @Column({ name: 'profile_image_url', nullable: true })
    public profileImageUrl: string;

    @Column({ name: 'subscription_id', nullable: true })
    public subscriptionId: string;
    
    @CreateDateColumn({ name: 'created_at' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    public updatedAt: Date;
}
