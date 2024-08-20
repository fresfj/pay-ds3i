import _ from '@lodash';
import mockApi from '../mock-api.json';
import ExtendedMockAdapter, { Params } from '../ExtendedMockAdapter';
import { MailboxAction, MailboxFolder, MailboxLabel } from '../../app/main/apps/mailbox/MailboxApi';

const mailsDB = mockApi.components.examples.mailbox_mails.value;
const labelsDB = mockApi.components.examples.mailbox_labels.value;
const filtersDB = mockApi.components.examples.mailbox_filters.value;
const foldersDB = mockApi.components.examples.mailbox_folders.value;

export const mailBoxApiMocks = (mock: ExtendedMockAdapter) => {
	mock.onGet('/mailbox/mails/filters/:filterSlug').reply((config) => {
		const { filterSlug } = config.params as Params;

		const response = _.filter(mailsDB, { [filterSlug]: true });

		return [200, response];
	});

	mock.onGet('/mailbox/mails/labels/:labelSlug').reply((config) => {
		const { labelSlug } = config.params as Params;

		const labelId = (_.find(labelsDB, { slug: labelSlug }) as MailboxLabel).id;

		const response = _.filter(mailsDB, (item) => item.labels.includes(labelId));

		return [200, response];
	});

	mock.onGet('/mailbox/mails/:folderSlug').reply((config) => {
		const { folderSlug } = config.params as Params;

		const folderId = (_.find(foldersDB, { slug: folderSlug }) as MailboxFolder).id;

		const response = _.filter(mailsDB, { folder: folderId });

		return [200, response];
	});

	mock.onGet('/mailbox/mail/:id').reply((config) => {
		const { id } = config.params as Params;

		const response = _.find(mailsDB, { id });

		if (!response) {
			return [404, 'Requested mail do not exist.'];
		}

		return [200, response];
	});

	mock.onGet('/mailbox/folders').reply(() => {
		return [200, foldersDB];
	});

	mock.onGet('/mailbox/filters').reply(() => {
		return [200, filtersDB];
	});

	mock.onGet('/mailbox/labels').reply(() => {
		return [200, labelsDB];
	});

	mock.onPost('/mailbox/mails/actions').reply((config) => {
		const { type, value, ids } = JSON.parse(config.data as string) as {
			type: MailboxAction;
			value: boolean | string | string[];
			ids: string[];
		};

		if (type === 'labels') {
			_.assign(
				mailsDB,
				mailsDB.map((_mail) =>
					ids.includes(_mail.id)
						? {
								..._mail,
								labels: value
							}
						: _mail
				)
			);
			return [200, true];
		}

		if (type === 'label') {
			_.assign(
				mailsDB,
				mailsDB.map((_mail) =>
					ids.includes(_mail.id)
						? {
								..._mail,
								labels: _mail.labels.includes(value as string) ? _mail.labels : [..._mail.labels, value]
							}
						: _mail
				)
			);
			return [200, true];
		}

		if (type === 'folder') {
			_.assign(
				mailsDB,
				mailsDB.map((_mail) =>
					ids.includes(_mail.id)
						? {
								..._mail,
								folder: value
							}
						: _mail
				)
			);
			return [200, true];
		}

		if (type === 'starred') {
			_.assign(
				mailsDB,
				mailsDB.map((_mail) =>
					ids.includes(_mail.id)
						? {
								..._mail,
								starred: value
							}
						: _mail
				)
			);
			return [200, true];
		}

		if (type === 'important') {
			_.assign(
				mailsDB,
				mailsDB.map((_mail) =>
					ids.includes(_mail.id)
						? {
								..._mail,
								important: value
							}
						: _mail
				)
			);
			return [200, true];
		}

		if (type === 'unread') {
			_.assign(
				mailsDB,
				mailsDB.map((_mail) =>
					ids.includes(_mail.id)
						? {
								..._mail,
								unread: value
							}
						: _mail
				)
			);
			return [200, true];
		}

		return [404, false];
	});
};
