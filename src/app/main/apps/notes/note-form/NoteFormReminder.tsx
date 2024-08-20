import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useMemo } from 'react';
import { NotesNote } from '../NotesApi';

type NoteFormReminderProps = {
	reminder: NotesNote['reminder'];
	onChange: (T: NotesNote['reminder']) => void;
};

/**
 * The note form reminder.
 */
function NoteFormReminder(props: NoteFormReminderProps) {
	const { reminder, onChange } = props;

	return useMemo(
		() => (
			<DateTimePicker
				disablePast
				value={reminder ? new Date(reminder) : null}
				onChange={(val) => onChange(val.toString())}
				defaultValue={new Date(Date.now())}
				sx={{
					'& .MuiInputAdornment-root': {
						minWidth: 40,
						minHeight: 40,
						m: 0
					},
					'& .MuiOutlinedInput-notchedOutline': {
						display: 'none'
					},
					'& .MuiOutlinedInput-root': {
						padding: 0
					},
					'& .MuiInputBase-input': {
						position: 'absolute',
						pointerEvents: 'none',
						visibility: 'hidden'
					}
				}}
				slotProps={{
					actionBar: {
						actions: ['clear', 'today']
					}
				}}
				slots={{
					openPickerIcon: () => <FuseSvgIcon size={20}>heroicons-outline:bell</FuseSvgIcon>
				}}
			/>
		),
		[reminder]
	);
}

export default NoteFormReminder;
