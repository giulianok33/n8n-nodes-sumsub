import { INodeProperties } from 'n8n-workflow';

export const sumsubOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['applicant'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new applicant',
				action: 'Create an applicant',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get applicant information',
				action: 'Get an applicant',
			},
			{
				name: 'Get by External ID',
				value: 'getByExternalId',
				description: 'Get applicant information by external user ID',
				action: 'Get applicant by external ID',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				description: 'Get applicant verification status',
				action: 'Get applicant status',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update applicant information',
				action: 'Update an applicant',
			},
			{
				name: 'Add Tags',
				value: 'addTags',
				description: 'Add custom tags to an applicant',
				action: 'Add applicant tags',
			},
			{
				name: 'Change Profile Data',
				value: 'changeProfileData',
				description: 'Change profile data details',
				action: 'Change applicant profile data',
			},
			{
				name: 'Remove Tags',
				value: 'removeTags',
				description: 'Remove custom tags from an applicant',
				action: 'Remove applicant tags',
			},
			{
				name: 'Reset Verification Step',
				value: 'resetStep',
				description: 'Reset a specific verification step for an applicant',
				action: 'Reset verification step',
			},
			{
				name: 'Add Note',
				value: 'addNote',
				description: 'Add a note to an applicant profile',
				action: 'Add applicant note',
			},
			{
				name: 'Update Metadata',
				value: 'updateMetadata',
				description: 'Update a specific metadata key while interpreting others',
				action: 'Update metadata',
			},
			{
				name: 'Remove All Metadata',
				value: 'removeAllMetadata',
				description: 'Remove all metadata from an applicant',
				action: 'Remove all metadata',
			},
			{
				name: 'Add Metadata',
				value: 'addMetadata',
				description: 'Add or update metadata keys while preserving others',
				action: 'Add metadata',
			},
			{
				name: 'Remove Metadata Keys',
				value: 'removeMetadataKey',
				description: 'Remove specific metadata keys from an applicant',
				action: 'Remove metadata keys',
			},
			{
				name: 'Change Level',
				value: 'changeLevel',
				description: 'Move an applicant to a different verification level',
				action: 'Change applicant level',
			},
			{
				name: 'Change Provided Info',
				value: 'changeProvidedInfo',
				description: 'Change applicant provided info (fixedInfo) after verification',
				action: 'Change applicant provided info',
			},
			{
				name: 'Change Status to Init',
				value: 'changeApplicantStatusToInit',
				description: 'Reset applicant status to Init (Documents Requested) to allow re-upload',
				action: 'Change applicant status to init',
			},
			{
				name: 'Get Verification Levels',
				value: 'getLevels',
				description: 'Get all verification levels',
				action: 'Get verification levels',
			},
		],
		default: 'get',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['sdkIntegration'],
			},
		},
		options: [
			{
				name: 'Generate WebSDK Link',
				value: 'generateWebsdkLink',
				description: 'Generate an external WebSDK link for applicant verification',
				action: 'Generate web sdk link',
			},
		],
		default: 'generateWebsdkLink',
	},
];

export const sumsubFields: INodeProperties[] = [
	// Create applicant fields
	{
		displayName: 'External User ID',
		name: 'externalUserId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['applicant'],
				operation: ['create', 'getByExternalId'],
			},
		},
		default: '',
		description: 'External user ID from your system',
	},
	{
		displayName: 'Level Name',
		name: 'levelName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['applicant'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Verification level name',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['applicant'],
				operation: ['create'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				placeholder: 'name@email.com',
				description: 'Applicant email address',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Applicant phone number',
			},
			{
				displayName: 'Source Key',
				name: 'sourceKey',
				type: 'string',
				default: '',
				description: 'Helps group clients sending applicants',
			},
		],
	},

	// Get applicant fields
	{
		displayName: 'Applicant ID',
		name: 'applicantId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['applicant'],
				operation: [
					'get',
					'getStatus',
					'update',
					'addTags',
					'removeTags',
					'changeProfileData',
					'resetStep',
					'addNote',
					'updateMetadata',
					'removeAllMetadata',
					'removeMetadataKey',
					'addMetadata',
					'changeLevel',
					'changeProvidedInfo',
				],
			},
		},
		default: '',
		description: 'The applicant ID to retrieve',
	},

	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['applicant'],
				operation: ['update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				placeholder: 'name@email.com',
				description: 'Applicant email address',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Applicant phone number',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'Applicant first name',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'Applicant last name',
			},
		],
	},

	// Add Applicant Tags fields
	{
		displayName: 'Tags',
		name: 'tags',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['applicant'],
				operation: ['addTags', 'removeTags'],
			},
		},
		default: {},
		description: 'Tags to add or remove',
		options: [
			{
				name: 'tagList',
				displayName: 'Tag',
				values: [
					{
						displayName: 'Tag Name',
						name: 'tagName',
						type: 'string',
						default: '',
						description: 'Name of the tag',
					},
				],
			},
		],
	},

	// Change Profile Data fields
	{
		displayName: 'Fields to Update',
		name: 'changeProfileDataFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['applicant'],
				operation: ['changeProfileData'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'External User ID',
				name: 'externalUserId',
				type: 'string',
				default: '',
				description: 'External user ID from your system',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				placeholder: 'name@email.com',
				description: 'Applicant email address',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Applicant phone number',
			},
			{
				displayName: 'Source Key',
				name: 'sourceKey',
				type: 'string',
				default: '',
				description: 'Helps group clients sending applicants',
			},
			{
				displayName: 'Language',
				name: 'lang',
				type: 'string',
				default: '',
				description: 'Perferred language',
			},
			{
				displayName: 'Registration Date',
				name: 'registrationDate',
				type: 'dateTime',
				default: '',
				description: 'Date and time when the applicant was initially registered in your system',
			},
		],
	},
	{
		displayName: 'Metadata',
		name: 'metadata',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['applicant'],
				operation: ['changeProfileData'],
			},
		},
		default: '[]',
		description: 'Metadata key-value pairs as JSON array (e.g. [{"key": "key1", "value": "value1"}])',
	},



	// Reset Verification Step fields
	{
		displayName: 'Step to Reset',
		name: 'stepToReset',
		type: 'multiOptions',
		options: [
			{ name: 'Identity', value: 'IDENTITY' },
			{ name: 'Selfie', value: 'SELFIE' },
			{ name: 'Proof of Residence', value: 'PROOF_OF_RESIDENCE' },
			{ name: 'Phone Verification', value: 'PHONE_VERIFICATION' },
			{ name: 'Email Verification', value: 'EMAIL_VERIFICATION' },
			{ name: 'Questionnaire', value: 'QUESTIONNAIRE' },
			{ name: 'Company Data', value: 'COMPANY_DATA' },
			{ name: 'Company Documents', value: 'COMPANY_DOCUMENTS' },
			{ name: 'Applicant Data', value: 'APPLICANT_DATA' },
		],
		default: [],
		description: 'The verification step to reset',
		displayOptions: {
			show: {
				resource: ['applicant'],
				operation: ['resetStep'],
			},
		},
	},

	// Add Note fields
	{
		displayName: 'Note',
		name: 'note',
		type: 'string',
		default: '',
		description: 'The note content to add',
		required: true,
		displayOptions: {
			show: {
				resource: ['applicant'],
				operation: ['addNote'],
			},
		},
	},
	{
		displayName: 'Tags',
		name: 'tags',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['applicant'],
				operation: ['addNote'],
			},
		},
		default: {},
		description: 'Tags to attach to the note',
		options: [
			{
				name: 'tagList',
				displayName: 'Tag',
				values: [
					{
						displayName: 'Tag Name',
						name: 'tagName',
						type: 'string',
						default: '',
						description: 'Name of the tag',
					},
				],
			},
		],
	},

	// Update Metadata fields
	{
		displayName: 'Metadata Updates',
		name: 'metadataUpdates',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['applicant'],
				operation: ['updateMetadata', 'addMetadata'],
			},
		},
		default: {},
		description: 'Metadata key-value pairs to update',
		options: [
			{
				name: 'updates',
				displayName: 'Update',
				values: [
					{
						displayName: 'Key',
						name: 'key',
						type: 'string',
						default: '',
						description: 'The key of the metadata item to update',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'The new value for the metadata item',
					},
				],
			},
		],
	},

	// Remove Metadata Keys fields
	{
		displayName: 'Keys to Remove',
		name: 'keysToRemove',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['applicant'],
				operation: ['removeMetadataKey'],
			},
		},
		default: {},
		description: 'Keys of the metadata items to remove',
		options: [
			{
				name: 'keyList',
				displayName: 'Key',
				values: [
					{
						displayName: 'Key Name',
						name: 'keyName',
						type: 'string',
						default: '',
						description: 'The key of the metadata item to remove',
					},
				],
			},
		],
	},

	// Change Level fields
	{
		displayName: 'New Level Name',
		name: 'newLevelName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['applicant'],
				operation: ['changeLevel'],
			},
		},
		default: '',
		description: 'The new level name to move the applicant to',
	},
	{
		displayName: 'Reset Verification Steps',
		name: 'resetVerificationSteps',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['applicant'],
				operation: ['changeLevel'],
			},
		},
		default: false,
		description: 'Whether to reset verification steps',
	},

	// Generate WebSDK Link fields
	{
		displayName: 'Level Name',
		name: 'levelName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sdkIntegration'],
				operation: ['generateWebsdkLink'],
			},
		},
		default: '',
		description: 'Verification level name',
	},
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sdkIntegration'],
				operation: ['generateWebsdkLink'],
			},
		},
		default: '',
		description: 'External user identifier',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['sdkIntegration'],
				operation: ['generateWebsdkLink'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				placeholder: 'name@email.com',
				description: 'Applicant email address',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Applicant phone number',
			},
			{
				displayName: 'TTL In Seconds',
				name: 'ttlInSecs',
				type: 'number',
				default: 1800,
				description: 'Time-to-live for the link in seconds (e.g., 1800 or 3600)',
			},
			{
				displayName: 'External Action ID',
				name: 'externalActionId',
				type: 'string',
				default: '',
				description: 'Specific action identifier',
			},
		],
	},
	// Change Provided Info fields
	{
		displayName: 'Fixed Info',
		name: 'fixedInfo',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['applicant'],
				operation: ['changeProvidedInfo'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'Applicant first name',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'Applicant last name',
			},
			{
				displayName: 'Middle Name',
				name: 'middleName',
				type: 'string',
				default: '',
				description: 'Applicant middle name',
			},
			{
				displayName: 'Legal Name',
				name: 'legalName',
				type: 'string',
				default: '',
				description: 'Applicant legal name',
			},
			{
				displayName: 'Gender',
				name: 'gender',
				type: 'options',
				options: [
					{
						name: 'Male',
						value: 'M',
					},
					{
						name: 'Female',
						value: 'F',
					},
				],
				default: 'M',
				description: 'Applicant gender',
			},
			{
				displayName: 'Date of Birth',
				name: 'dob',
				type: 'string',
				default: '',
				placeholder: 'YYYY-MM-DD',
				description: 'Applicant date of birth',
			},
			{
				displayName: 'Place of Birth',
				name: 'placeOfBirth',
				type: 'string',
				default: '',
				description: 'Applicant place of birth',
			},
			{
				displayName: 'Country of Birth',
				name: 'countryOfBirth',
				type: 'string',
				default: '',
				description: 'Applicant country of birth (ISO 3166-1 alpha-3 code)',
			},
			{
				displayName: 'State of Birth',
				name: 'stateOfBirth',
				type: 'string',
				default: '',
				description: 'Applicant state of birth',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'Applicant country (ISO 3166-1 alpha-3 code)',
			},
			{
				displayName: 'Nationality',
				name: 'nationality',
				type: 'string',
				default: '',
				description: 'Applicant nationality (ISO 3166-1 alpha-3 code)',
			},
		],
	},
];
