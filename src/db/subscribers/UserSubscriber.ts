import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
  LoadEvent
} from 'typeorm';
import { User } from '../entities/User';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  /**
   * Indicates that this subscriber only listen to User events.
   */
  listenTo() {
    return User;
  }

  /**
   * Called before user insertion.
   */
  beforeInsert(event: InsertEvent<User>) {
    // Normalize email
    if (event.entity.email) {
      event.entity.email = event.entity.email.toLowerCase().trim();
    }
  }

  /**
   * Called after user insertion.
   */
  afterInsert(event: InsertEvent<User>) {
    console.log(`User created: ${event.entity.email}`);
  }

  /**
   * Called before user update.
   */
  beforeUpdate(event: UpdateEvent<User>) {
    // Normalize email if it's being updated
    if (event.entity?.email) {
      event.entity.email = event.entity.email.toLowerCase().trim();
    }
  }

  /*
   * EXAMPLE EVENT HANDLERS (uncomment and modify as needed):
   *
   * Called after user update - useful for cache invalidation, notifications
   */
  // afterUpdate(event: UpdateEvent<User>) {
  //   console.log(`User updated: ${event.entity?.email}`);
  //   // Examples:
  //   // - CacheService.invalidateUser(event.entity.id);
  //   // - SearchService.updateUserIndex(event.entity);
  //   // - NotificationService.notifyProfileChange(event.entity);
  // }

  /*
   * Called before user removal - useful for validation, archiving
   */
  // beforeRemove(event: RemoveEvent<User>) {
  //   console.log(`Removing user: ${event.entity?.email}`);
  //   // Examples:
  //   // - ArchiveService.backupUserData(event.entity);
  //   // - Check if user can be deleted (has active orders, etc.)
  //   // - if (await OrderService.hasActiveOrders(event.entity.id)) {
  //   //     throw new Error("Cannot delete user with active orders");
  //   //   }
  // }

  /*
   * Called after user removal - useful for cleanup, logging
   */
  // afterRemove(event: RemoveEvent<User>) {
  //   console.log(`User deleted: ${event.entity?.email}`);
  //   // Examples:
  //   // - FileService.deleteUserFiles(event.entity.id);
  //   // - EmailService.sendAccountDeletionConfirmation(event.entity.email);
  //   // - AuditService.logUserDeletion(event.entity.id);
  // }

  /*
   * Called after user is loaded from database - useful for computed fields
   */
  // afterLoad(entity: User, event?: LoadEvent<User>) {
  //   // Examples:
  //   // - Decrypt sensitive fields
  //   // - Add computed properties
  //   // - Log access for security auditing
  //   // console.log(`User loaded: ${entity.email}`);
  // }
}
