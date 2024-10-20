import { useFormContext } from 'react-hook-form';
import { Typography, Grid, Button, Table, TableHead, TableCell, TableRow, TableBody, Stack, TableContainer, Toolbar } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { Iconify } from '@fuse/components/iconify';
import _ from '@lodash';
import * as XLSX from 'xlsx';
import { UploadBox } from '@fuse/components/upload';

const formatPhoneNumber = (phoneNumber) => {
	if (typeof phoneNumber !== 'string') {
		return phoneNumber
	}
	return Number(phoneNumber.replace(/[^\d]/g, ''));
}

const removeDuplicates = (arr) => {
	const seen = new Set();
	return arr.filter(contact => {
		const isDuplicate = seen.has(contact.phone);
		seen.add(contact.phone);
		return !isDuplicate;
	});
};
/**
 * The shipping tab.
 */
function RulesTab() {
	const methods = useFormContext();
	const { control, watch, formState: { isValid, dirtyFields, errors }, setValue, trigger, getValues, setError, clearErrors } = methods;
	const contacts = watch(`contacts`)
	const [previewData, setPreviewData] = useState([]);


	const handleFileUpload = (event) => {
		const file = event[0];
		const reader = new FileReader();
		reader.onload = (e: any) => {
			const data = new Uint8Array(e.target.result);
			const workbook = XLSX.read(data, { type: 'array' });
			const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
			const leads = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

			const formattedLeads = leads.slice(1).map(row => ({
				name: row[0],
				phone: formatPhoneNumber(row[1]),
			}));

			setPreviewData(formattedLeads);
		};

		reader.readAsArrayBuffer(file);
	};

	const handleImport = async () => {
		const unifiedArray = removeDuplicates([...contacts, ...previewData]);
		setValue(`contacts`, unifiedArray, { shouldValidate: true, shouldDirty: true })
		const result = await trigger();
		if (result) {
			clearErrors(); // Limpa todos os erros
			console.log('Form is valid:', true);
		} else {
			const values = getValues();
			Object.keys(values).forEach((key) => {
				if (!values[key]) {
					setError(key, { type: 'manual', message: 'This field is required' });
				} else {
					clearErrors(key);
				}
			});
		}
	};

	const [files, setFiles] = useState<(File | string)[]>([]);
	const [file, setFile] = useState<File | string | null>(null);
	const [avatarUrl, setAvatarUrl] = useState<File | string | null>(null);

	const handleDropMultiFile = useCallback(
		(acceptedFiles: File[]) => {
			setFiles([...files, ...acceptedFiles]);
		},
		[files]
	);

	const handleRemoveFile = (inputFile: File | string) => {
		const filesFiltered = files.filter((fileFiltered) => fileFiltered !== inputFile);
		setFiles(filesFiltered);
	};

	const handleRemoveAllFiles = () => {
		setFiles([]);
	};

	return (
		<div>
			<div className="flex flex-column sm:flex-row w-full items-center space-x-16">
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<div className="flex-1">
							<div className="flex items-center mb-12">
								<Iconify icon="solar:cloud-upload-bold-duotone" width={20} />
								<Typography className="font-semibold text-16 mx-8">Upload file</Typography>
							</div>
							<UploadBox
								multiple
								value={files}
								onDrop={handleDropMultiFile}
								onRemove={handleRemoveFile}
								onRemoveAll={handleRemoveAllFiles}
								onUpload={() => handleFileUpload(files)}
								placeholder={
									<Stack spacing={0.5} alignItems="center">
										<Iconify icon="eva:cloud-upload-fill" width={40} />
										<Typography variant="body2">Upload file</Typography>
									</Stack>
								}
								sx={{ py: 2.5, height: 'auto', width: '100%' }}
							/>
						</div>
					</Grid>
					{previewData.length > 0 && (
						<Grid item xs={12}>
							<Typography
								sx={{ flex: '1 1 100%', mb: 2 }}
								variant="h6"
								id="tableTitle"
								component="div"
								gutterBottom
							>
								<Iconify icon="solar:clipboard-list-bold-duotone" width={28} sx={{ mr: 1 }} />
								Preview
							</Typography>
							<TableContainer sx={{ maxHeight: 440 }}>
								<Table stickyHeader aria-label="sticky table">
									<TableHead>
										<TableRow>
											<TableCell width={20}>N˚</TableCell>
											<TableCell>Name</TableCell>
											<TableCell>Phone</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{previewData.map((lead, index) => (
											<TableRow hover role="checkbox" tabIndex={-1} key={index}>
												<TableCell>{(index + 1)}</TableCell>
												<TableCell>{lead.name}</TableCell>
												<TableCell>{lead.phone}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
							<Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ mt: 2 }}>
								<Button
									size="small"
									variant="contained"
									onClick={handleImport}
									startIcon={<Iconify icon="eva:cloud-upload-fill" />}
								>
									Confirm Import
								</Button>
							</Stack>
						</Grid>
					)}
					{contacts && contacts.length > 0 && (
						<Grid item xs={12}>
							<Typography
								sx={{ flex: '1 1 100%', mb: 2 }}
								variant="h6"
								id="tableTitle"
								component="div"
								gutterBottom
							>
								<Iconify icon="solar:users-group-rounded-bold-duotone" width={28} sx={{ mr: 1 }} />
								{contacts.length} Contatos
							</Typography>
							<TableContainer sx={{ maxHeight: 440 }}>
								<Table stickyHeader aria-label="sticky table">
									<TableHead>
										<TableRow>
											<TableCell width={20}>N˚</TableCell>
											<TableCell>Name</TableCell>
											<TableCell>Phone</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{contacts.map((lead, index) => (
											<TableRow hover role="checkbox" tabIndex={-1} key={index}>
												<TableCell>{(index + 1)}</TableCell>
												<TableCell>{lead.name}</TableCell>
												<TableCell>{lead.phone}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</Grid>
					)}
				</Grid>
			</div>
		</div>
	);
}

export default RulesTab;
