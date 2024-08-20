import FuseUtils from '@fuse/utils';
import getUnixTime from 'date-fns/getUnixTime';
import _ from '@lodash';
import { PartialDeep } from 'type-fest';
import { ScrumboardComment } from '../ScrumboardApi';

/**
 * The comment model.
 */
function CommentModel(data: PartialDeep<ScrumboardComment>): ScrumboardComment {
	data = data || {};

	return _.defaults(data, {
		id: FuseUtils.generateGUID(),
		type: 'comment',
		idMember: null,
		message: '',
		time: getUnixTime(new Date())
	});
}

export default CommentModel;
