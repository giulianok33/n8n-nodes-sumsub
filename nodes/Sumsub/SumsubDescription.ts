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
				operation: ['create'],
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
				operation: ['get', 'getStatus', 'update', 'addTags', 'changeProfileData'],
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
				operation: ['addTags'],
			},
		},
		default: {},
		description: 'Tags to add to the applicant',
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
		],
	},
	{
		displayName: 'Metadata',
		name: 'metadata',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['applicant'],
				operation: ['changeProfileData'],
			},
		},
		default: {},
		description: 'Metadata key-value pairs',
		options: [
			{
				name: 'metadataValues',
				displayName: 'Metadata',
				values: [
					{
						displayName: 'Key',
						name: 'key',
						type: 'string',
						default: '',
						description: 'Metadata key',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Metadata value',
					},
				],
			},
		],
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
];
