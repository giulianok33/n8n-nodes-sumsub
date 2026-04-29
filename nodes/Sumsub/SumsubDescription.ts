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
				name: 'Add Metadata',
				value: 'addMetadata',
				description: 'Add or update metadata keys while preserving others',
				action: 'Add metadata',
			},
			{
				name: 'Add Note',
				value: 'addNote',
				description: 'Add a note to an applicant profile',
				action: 'Add applicant note',
			},
			{
				name: 'Add Tags',
				value: 'addTags',
				description: 'Add custom tags to an applicant',
				action: 'Add applicant tags',
			},
			{
				name: 'Change Level',
				value: 'changeLevel',
				description: 'Move an applicant to a different verification level',
				action: 'Change applicant level',
			},
			{
				name: 'Change Profile Data',
				value: 'changeProfileData',
				description: 'Change profile data details',
				action: 'Change applicant profile data',
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
				name: 'Create',
				value: 'create',
				description: 'Create a new applicant',
				action: 'Create an applicant',
			},
			{
				name: 'Deactivate',
				value: 'deactivate',
				description: 'Deactivate an applicant profile',
				action: 'Deactivate applicant',
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
				name: 'Get Review History',
				value: 'getReviewHistory',
				description: 'Get the review history of an applicant profile',
				action: 'Get applicant review history',
			},
			{
				name: 'Get Review Status',
				value: 'getReviewStatus',
				description: 'Get applicant review status (when utilizing WebSDK or MobileSDK)',
				action: 'Get applicant review status',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				description: 'Get applicant verification status',
				action: 'Get applicant status',
			},
			{
				name: 'Get Verification Levels',
				value: 'getLevels',
				description: 'Get all verification levels',
				action: 'Get verification levels',
			},
			{
				name: 'Remove All Metadata',
				value: 'removeAllMetadata',
				description: 'Remove all metadata from an applicant',
				action: 'Remove all metadata',
			},
			{
				name: 'Remove Metadata Keys',
				value: 'removeMetadataKey',
				description: 'Remove specific metadata keys from an applicant',
				action: 'Remove metadata keys',
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
				name: 'Send Email to Beneficiaries',
				value: 'sendEmailToBeneficiaries',
				description: 'Send mass email notifications recursively to all associated parties within a company structure',
				action: 'Send email to beneficiaries',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update applicant information',
				action: 'Update an applicant',
			},
			{
				name: 'Update Metadata',
				value: 'updateMetadata',
				description: 'Update a specific metadata key while interpreting others',
				action: 'Update metadata',
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
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['transaction'],
			},
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a transaction from the system',
				action: 'Delete a transaction',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get transaction information',
				action: 'Get a transaction',
			},
			{
				name: 'Get Tags',
				value: 'getTags',
				description: 'Get custom tags assigned to a transaction',
				action: 'Get transaction tags',
			},
		],
		default: 'delete',
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
					'getReviewHistory',
					'getReviewStatus',
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
					'changeApplicantStatusToInit',
					'deactivate',
					'sendEmailToBeneficiaries',
				],
			},
		},
		default: '',
		description: 'The applicant ID to retrieve',
	},

	// Get Review History extra fields
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['applicant'],
				operation: ['getReviewHistory'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Level Name',
				name: 'levelName',
				type: 'string',
				default: '',
				description: 'Filter review history by verification level name',
			},
		],
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
			sortable: true,
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
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				placeholder: 'name@email.com',
				description: 'Applicant email address',
			},
			{
				displayName: 'External User ID',
				name: 'externalUserId',
				type: 'string',
				default: '',
				description: 'External user ID from your system',
			},
			{
				displayName: 'Language',
				name: 'lang',
				type: 'string',
				default: '',
				description: 'Perferred language',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Applicant phone number',
			},
			{
				displayName: 'Registration Date',
				name: 'registrationDate',
				type: 'dateTime',
				default: '',
				description: 'Date and time when the applicant was initially registered in your system',
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



	// Reset Verification Step fields
	{
		displayName: 'Step to Reset',
		name: 'stepToReset',
		type: 'multiOptions',
		options: [
			{ name: 'Applicant Data', value: 'APPLICANT_DATA' },
			{ name: 'Company Data', value: 'COMPANY_DATA' },
			{ name: 'Company Documents', value: 'COMPANY_DOCUMENTS' },
			{ name: 'Email Verification', value: 'EMAIL_VERIFICATION' },
			{ name: 'Identity', value: 'IDENTITY' },
			{ name: 'Phone Verification', value: 'PHONE_VERIFICATION' },
			{ name: 'Proof of Residence', value: 'PROOF_OF_RESIDENCE' },
			{ name: 'Questionnaire', value: 'QUESTIONNAIRE' },
			{ name: 'Selfie', value: 'SELFIE' },
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
			sortable: true,
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
			sortable: true,
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
			sortable: true,
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
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'Applicant country (ISO 3166-1 alpha-3 code)',
			},
			{
				displayName: 'Country of Birth',
				name: 'countryOfBirth',
				type: 'string',
				default: '',
				description: 'Applicant country of birth (ISO 3166-1 alpha-3 code)',
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
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'Applicant first name',
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
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'Applicant last name',
			},
			{
				displayName: 'Legal Name',
				name: 'legalName',
				type: 'string',
				default: '',
				description: 'Applicant legal name',
			},
			{
				displayName: 'Middle Name',
				name: 'middleName',
				type: 'string',
				default: '',
				description: 'Applicant middle name',
			},
			{
				displayName: 'Nationality',
				name: 'nationality',
				type: 'string',
				default: '',
				description: 'Applicant nationality (ISO 3166-1 alpha-3 code)',
			},
			{
				displayName: 'Place of Birth',
				name: 'placeOfBirth',
				type: 'string',
				default: '',
				description: 'Applicant place of birth',
			},
			{
				displayName: 'State of Birth',
				name: 'stateOfBirth',
				type: 'string',
				default: '',
				description: 'Applicant state of birth',
			},
		],
	},
	// Change Applicant Status to Init fields
	{
		displayName: 'Reasons',
		name: 'reasons',
		type: 'fixedCollection',
		placeholder: 'Add Reason',
		default: {},
		typeOptions: {
			multipleValues: true,
			sortable: true,
		},
		displayOptions: {
			show: {
				resource: ['applicant'],
				operation: ['changeApplicantStatusToInit'],
			},
		},
		options: [
			{
				name: 'reasonsList',
				displayName: 'Reason',
				values: [
					{
						displayName: 'Category',
						name: 'category',
						type: 'options',
						options: [
							{ name: 'Abuse', value: 'abuse' },
							{ name: 'Device', value: 'device' },
							{ name: 'Finance', value: 'finance' },
							{ name: 'Fraud', value: 'fraud' },
							{ name: 'Manual', value: 'manual' },
							{ name: 'Regulation', value: 'regulation' },
						],
						default: 'manual',
						description: 'Category of the rejection reason',
					},
					// Manual Reasons
					{
						displayName: 'Reason Code',
						name: 'manualCode',
						type: 'options',
						displayOptions: {
							show: {
								category: ['manual'],
							},
						},
						options: [
							{ name: 'Risk Team Decision', value: 'riskTeamDecision' },
							{ name: 'Additional Document Request', value: 'additionalDocumentRequest' },
						],
						default: 'additionalDocumentRequest',
						description: 'Reason code for Manual category',
					},
					// Fraud Reasons
					{
						displayName: 'Reason Code',
						name: 'fraudCode',
						type: 'options',
						displayOptions: {
							show: {
								category: ['fraud'],
							},
						},
						options: [
							{ name: 'Document Forgery', value: 'documentForgery' },
							{ name: 'Elder Abuse', value: 'elderAbuse' },
							{ name: 'Fake Contact Data', value: 'fakeContactData' },
							{ name: 'Image Manipulation', value: 'imageManipulation' },
							{ name: 'Location Manipulation', value: 'locationManipulation' },
							{ name: 'Multi Accounting', value: 'multiAccounting' },
							{ name: 'Social Engineering', value: 'socialEngineering' },
							{ name: 'Stolen Identity', value: 'stolenIdentity' },
						],
						default: 'documentForgery',
						description: 'Reason code for Fraud category',
					},
					// Finance Reasons
					{
						displayName: 'Reason Code',
						name: 'financeCode',
						type: 'options',
						displayOptions: {
							show: {
								category: ['finance'],
							},
						},
						options: [
							{ name: 'Card Scam', value: 'cardScam' },
							{ name: 'Chargeback', value: 'chargeback' },
							{ name: 'High Risk Payment Method', value: 'highRiskPaymentMethod' },
							{ name: 'Money Muling', value: 'moneyMuling' },
							{ name: 'Suspicious Accounts', value: 'suspiciousAccounts' },
						],
						default: 'chargeback',
						description: 'Reason code for Finance category',
					},
					// Regulation Reasons
					{
						displayName: 'Reason Code',
						name: 'regulationCode',
						type: 'options',
						displayOptions: {
							show: {
								category: ['regulation'],
							},
						},
						options: [
							{ name: 'Sanctioned Jurisdiction', value: 'sanctionedJurisdiction' },
							{ name: 'Sanctioned Person', value: 'sanctionedPerson' },
							{ name: 'Missing Required Documents', value: 'missingRequiredDocuments' },
						],
						default: 'missingRequiredDocuments',
						description: 'Reason code for Regulation category',
					},
					// Abuse Reasons
					{
						displayName: 'Reason Code',
						name: 'abuseCode',
						type: 'options',
						displayOptions: {
							show: {
								category: ['abuse'],
							},
						},
						options: [
							{ name: 'Account Sharing', value: 'accountSharing' },
							{ name: 'Automated Behavior', value: 'automatedBehavior' },
							{ name: 'Multi Accounting', value: 'multiAccounting' },
							{ name: 'Promotion Abuse', value: 'promotionAbuse' },
							{ name: 'Terms Violation', value: 'termsViolation' },
						],
						default: 'automatedBehavior',
						description: 'Reason code for Abuse category',
					},
					// Device Reasons
					{
						displayName: 'Reason Code',
						name: 'deviceCode',
						type: 'options',
						displayOptions: {
							show: {
								category: ['device'],
							},
						},
						options: [
							{ name: 'Blacklisted Device', value: 'blacklistedDevice' },
							{ name: 'Suspicious Device', value: 'suspiciousDevice' },
						],
						default: 'blacklistedDevice',
						description: 'Reason code for Device category',
					},
				],
			},
		],
	},
	{
		displayName: 'Note',
		name: 'note',
		type: 'string',
		default: '',
		description: 'The note content to add',
		displayOptions: {
			show: {
				resource: ['applicant'],
				operation: ['changeApplicantStatusToInit'],
			},
		},
	},
	{
		displayName: 'Tags',
		name: 'tags',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			sortable: true,
		},
		displayOptions: {
			show: {
				resource: ['applicant'],
				operation: ['changeApplicantStatusToInit'],
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
	{
		displayName: 'Transaction ID',
		name: 'txnId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['delete', 'get', 'getTags'],
			},
		},
		default: '',
		description: 'The transaction ID to perform the operation on',
	},
	{
		displayName: 'Pass Through Input Fields',
		name: 'passThroughInput',
		type: 'boolean',
		default: false,
		description: 'Whether to merge the incoming item fields into the Sumsub API response JSON',
	},
];
