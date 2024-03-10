import { StreamingNotification } from 'src/streamingnotification/domain/entity/streamingnotification.entity';
import { User } from 'src/user/domain/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';

@Entity('oauth2_credential')
export class Oauth2credential {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column({ name: 'platform', })
  public platform: string;

  @Column({ name: 'auth_timestamp', nullable: true })
  public authTimestamp: Date;

  /**
   * Completado -> filled
   * Sin Autorizacion -> without_authorization
   * En Progreso -> in_progress
   * Rechazado -> refused
   */
  @Column({ name: 'status' })
  public status: string;

  @Column({ name: 'user_id' })
  public userId: number;

  @ManyToOne(() => User, (user) => user.oauth2Credentials)
  @JoinColumn({ name: 'user_id'})
  public user: User;

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

  @ManyToMany(() => StreamingNotification, (oauth2Credential) => oauth2Credential.platformNotifications)
  public streamingNotification: StreamingNotification[];
  
  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;
}
