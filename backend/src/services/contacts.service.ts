import { contactsRepo } from '../repositories/contacts.repo';
import { activityRepo } from '../repositories/activity.repo';
import { CreateContactInput, UpdateContactInput } from '../validators/contacts.schema';

export const contactsService = {
  async getVisible() {
    return contactsRepo.findVisible();
  },

  async getAll() {
    return contactsRepo.findAll();
  },

  async create(input: CreateContactInput, actor: string) {
    const result = await contactsRepo.create(input);
    await activityRepo.create(actor, 'created_contact', input.name);
    return result;
  },

  async update(id: string, input: UpdateContactInput, actor: string) {
    const result = await contactsRepo.update(id, input);
    await activityRepo.create(actor, 'updated_contact', input.name || `Contact ${id}`);
    return result;
  },

  async delete(id: string, actor: string) {
    await contactsRepo.delete(id);
    await activityRepo.create(actor, 'deleted_contact', `Deleted contact ${id}`);
  },
};
