import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
	IHttpRequestOptions,
	IDataObject,
} from 'n8n-workflow';
import { createHmac } from 'crypto';
import { sumsubFields, sumsubOperations } from './SumsubDescription';

interface SumsubCredentials {
	appToken: string;
	appSecret: string;
	apiUrl: string;
}

interface ApplicantAdditionalFields {
	email?: string;
	phone?: string;
	sourceKey?: string;
	creationTrackingData?: string | object;
}

interface ApplicantUpdateFields {
	email?: string;
	phone?: string;
	firstName?: string;
	lastName?: string;
}

interface CreateApplicantBody extends IDataObject {
	externalUserId: string;
	levelName: string;
	email?: string;
	phone?: string;
	sourceKey?: string;
	creationTrackingData?: object;
}

interface UpdateApplicantBody extends IDataObject {
	email?: string;
	phone?: string;
	firstName?: string;
	lastName?: string;
}

interface GenerateWebsdkLinkBody extends IDataObject {
	levelName: string;
	userId: string;
	applicantIdentifiers?: {
		email?: string;
		phone?: string;
	};
	ttlInSecs?: number;
	externalActionId?: string;
}

interface ChangeProfileDataBody extends IDataObject {
	id: string;
	externalUserId?: string;
	email?: string;
	phone?: string;
	sourceKey?: string;
	lang?: string;
	registrationDate?: string;
	metadata?: Array<{ key: string; value: string }>;
}

interface WebsdkLinkResponse extends IDataObject {
	url: string;
}

interface ReviewResult extends IDataObject {
	reviewAnswer: 'GREEN' | 'RED';
	rejectLabels?: string[];
	reviewRejectType?: 'FINAL' | 'RETRY';
	clientComment?: string;
	moderationComment?: string;
	buttonIds?: string[];
}

interface ApplicantReview extends IDataObject {
	reviewId: string;
	levelName: string;
	attemptId: string;
	attemptCnt: number;
	elapsedSincePendingMs: number;
	createDate: string;
	reviewDate?: string;
	reviewResult?: ReviewResult;
	reviewStatus: 'init' | 'pending' | 'prechecked' | 'queued' | 'completed' | 'onHold';
}

interface ApplicantInfo extends IDataObject {
	firstName?: string;
	legalName?: string;
	firstNameEn?: string;
	middleName?: string;
	middleNameEn?: string;
	lastName?: string;
	lastNameEn?: string;
	gender?: 'M' | 'F';
	dob?: string;
	placeOfBirth?: string;
	countryOfBirth?: string;
	stateOfBirth?: string;
	country?: string;
	nationality?: string;
	tin?: string;
}

interface ApplicantData extends IDataObject {
	id: string;
	createdAt: string;
	clientId: string;
	inspectionId: string;
	externalUserId: string;
	sourceKey?: string;
	info?: ApplicantInfo;
	fixedInfo?: ApplicantInfo;
	email?: string;
	phone?: string;
	applicantPlatform?: string;
	ipCountry?: string;
	authCode?: string;
	lang?: string;
	metadata?: Array<{ key: string; value: string }>;
	type: 'individual' | 'company';
	tags?: string[];
	review?: ApplicantReview;
}

interface ChangeStatusToInitBody extends IDataObject {
	note?: string;
	tags?: string[];
	reasons?: {
		[key: string]: string[];
	};
}

type SumsubApiResponse = ApplicantData | ApplicantReview | WebsdkLinkResponse | IDataObject;

export class Sumsub implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Sumsub',
		name: 'sumsub',
		icon: 'file:sumsub.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Sumsub API for identity verification',
		defaults: {
			name: 'Sumsub',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'sumsubApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Applicant',
						value: 'applicant',
					},
					{
						name: 'SDK Integration',
						value: 'sdkIntegration',
					},
					{
						name: 'Transaction',
						value: 'transaction',
					},
				],
				default: 'applicant',
			},
			...sumsubOperations,
			...sumsubFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = (await this.getCredentials('sumsubApi')) as SumsubCredentials;
		const { appToken, appSecret, apiUrl } = credentials;

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let responseData: SumsubApiResponse;

				if (resource === 'applicant') {
					if (operation === 'create') {
						responseData = await createApplicant({
							executeFunctions: this,
							itemIndex: i,
							apiUrl,
							appToken,
							appSecret,
						});
					} else if (operation === 'get') {
						responseData = await getApplicant({
							executeFunctions: this,
							itemIndex: i,
							apiUrl,
							appToken,
							appSecret,
						});
					} else if (operation === 'getByExternalId') {
						responseData = await getApplicantByExternalId({
							executeFunctions: this,
							itemIndex: i,
							apiUrl,
							appToken,
							appSecret,
						});
					} else if (operation === 'getReviewHistory') {
						responseData = await getApplicantReviewHistory({
							executeFunctions: this,
							itemIndex: i,
							apiUrl,
							appToken,
							appSecret,
						});
					} else if (operation === 'getReviewStatus') {
						responseData = await getApplicantReviewStatus({
							executeFunctions: this,
							itemIndex: i,
							apiUrl,
							appToken,
							appSecret,
						});
					} else if (operation === 'getStatus') {
						responseData = await getApplicantStatus({
							executeFunctions: this,
							itemIndex: i,
							apiUrl,
							appToken,
							appSecret,
						});
					} else if (operation === 'update') {
						responseData = await updateApplicant({
							executeFunctions: this,
							itemIndex: i,
							apiUrl,
							appToken,
							appSecret,
						});
					} else if (operation === 'addTags') {
						responseData = await addApplicantTags({
							executeFunctions: this,
							itemIndex: i,
							apiUrl,
							appToken,
							appSecret,
						});
					} else if (operation === 'changeProfileData') {
						responseData = await changeProfileData({
							executeFunctions: this,
							itemIndex: i,
							apiUrl,
							appToken,
							appSecret,
						});
					} else if (operation === 'removeTags') {
						responseData = await removeApplicantTags({
							executeFunctions: this,
							itemIndex: i,
							apiUrl,
							appToken,
							appSecret,
						});
					} else if (operation === 'resetStep') {
						responseData = await resetVerificationStep({
							executeFunctions: this,
							itemIndex: i,
							apiUrl,
							appToken,
							appSecret,
						});
					} else if (operation === 'addNote') {
						responseData = await addApplicantNote({
							executeFunctions: this,
							itemIndex: i,
							apiUrl,
							appToken,
							appSecret,
						});

					} else if (operation === 'updateMetadata') {
						responseData = await updateApplicantMetadata({
							executeFunctions: this,
							itemIndex: i,
							apiUrl,
							appToken,
							appSecret,
						});
					} else if (operation === 'removeAllMetadata') {
						responseData = await removeAllApplicantMetadata({
							executeFunctions: this,
							itemIndex: i,
							apiUrl,
							appToken,
							appSecret,
						});
					} else if (operation === 'removeMetadataKey') {
						responseData = await removeApplicantMetadataKey({
							executeFunctions: this,
							itemIndex: i,
							apiUrl,
							appToken,
							appSecret,
						});
					} else if (operation === 'addMetadata') {
						responseData = await addApplicantMetadata({
							executeFunctions: this,
							itemIndex: i,
							apiUrl,
							appToken,
							appSecret,
						});
					} else if (operation === 'changeLevel') {
						responseData = await changeApplicantLevel({
							executeFunctions: this,
							itemIndex: i,
							apiUrl,
							appToken,
							appSecret,
						});
					} else if (operation === 'changeProvidedInfo') {
						responseData = await changeProvidedInfo({
							executeFunctions: this,
							itemIndex: i,
							apiUrl,
							appToken,
							appSecret,
						});
					} else if (operation === 'changeApplicantStatusToInit') {
						responseData = await changeApplicantStatusToInit({
							executeFunctions: this,
							itemIndex: i,
							apiUrl,
							appToken,
							appSecret,
						});
					} else if (operation === 'getLevels') {
						responseData = await getApplicantLevels({
							executeFunctions: this,
							itemIndex: i,
							apiUrl,
							appToken,
							appSecret,
						});
					} else if (operation === 'deactivate') {
						responseData = await deactivateApplicant({
							executeFunctions: this,
							itemIndex: i,
							apiUrl,
							appToken,
							appSecret,
						});
					} else if (operation === 'sendEmailToBeneficiaries') {
						responseData = await sendEmailToBeneficiaries({
							executeFunctions: this,
							itemIndex: i,
							apiUrl,
							appToken,
							appSecret,
						});
					} else {
						throw new NodeOperationError(
							this.getNode(),
							`The operation "${operation}" is not known!`,
						);
					}
				} else if (resource === 'sdkIntegration') {
					if (operation === 'generateWebsdkLink') {
						responseData = await generateWebsdkLink({
							executeFunctions: this,
							itemIndex: i,
							apiUrl,
							appToken,
							appSecret,
						});
					} else {
						throw new NodeOperationError(
							this.getNode(),
							`The operation "${operation}" is not known!`,
						);
					}
				} else if (resource === 'transaction') {
					if (operation === 'delete') {
						responseData = await deleteTransaction({
							executeFunctions: this,
							itemIndex: i,
							apiUrl,
							appToken,
							appSecret,
						});
					} else if (operation === 'get') {
						responseData = await getTransaction({
							executeFunctions: this,
							itemIndex: i,
							apiUrl,
							appToken,
							appSecret,
						});
					} else if (operation === 'getTags') {
						responseData = await getTransactionTags({
							executeFunctions: this,
							itemIndex: i,
							apiUrl,
							appToken,
							appSecret,
						});
					} else {
						throw new NodeOperationError(
							this.getNode(),
							`The operation "${operation}" is not known!`,
						);
					}
				} else {
					throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`);
				}

				const passThroughInput = this.getNodeParameter('passThroughInput', i, false) as boolean;
				let finalJson = responseData as IDataObject;
				if (passThroughInput) {
					finalJson = { ...items[i].json, ...finalJson };
				}

				returnData.push({
					json: finalJson,
					pairedItem: {
						item: i,
					},
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

function createSignature({
	method,
	path,
	timestamp,
	body,
	appSecret,
}: {
	method: string;
	path: string;
	timestamp: number;
	body: string;
	appSecret: string;
}): string {
	console.log('Computing signature for:', method.toUpperCase(), path, body);
	const message = timestamp + method.toUpperCase() + path + body;
	return createHmac('sha256', appSecret).update(message).digest('hex');
}

interface MakeRequestParams {
	executeFunctions: IExecuteFunctions;
	method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
	path: string;
	apiUrl: string;
	appToken: string;
	appSecret: string;
	body?: any;
	qs?: IDataObject;
}

async function makeRequest(params: MakeRequestParams): Promise<SumsubApiResponse> {
	const { executeFunctions, method, path, apiUrl, appToken, appSecret, body, qs } = params;
	const bodyString = body !== undefined ? JSON.stringify(body) : '';

	let pathWithQuery = path;
	if (qs && Object.keys(qs).length > 0) {
		const queryString = Object.keys(qs)
			.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(qs[key] as string)}`)
			.join('&');
		pathWithQuery += `?${queryString}`;
	}

	const options: IHttpRequestOptions = {
		method,
		url: path,
		baseURL: apiUrl,
		qs,
		headers: {
			'Content-Type': 'application/json',
			'X-App-Token': appToken,
		},
		json: true,
	};

	if (body) {
		options.body = body;
	}

	let attempt = 0;
	const maxRetries = 5;

	while (true) {
		try {
			const currentTimestamp = Math.floor(Date.now() / 1000);
			const currentSignature = createSignature({ method, path: pathWithQuery, timestamp: currentTimestamp, body: bodyString, appSecret });
			
			if (options.headers) {
				options.headers['X-App-Access-Sig'] = currentSignature;
				options.headers['X-App-Access-Ts'] = currentTimestamp.toString();
			}

			return await executeFunctions.helpers.request(options);
		} catch (error: any) {
			const statusCode = error.statusCode || error.status || (error.response && (error.response.statusCode || error.response.status));
			if (statusCode === 429 && attempt < maxRetries) {
				attempt++;
				// Sumsub limit buckets are 5.0 seconds. 
				// Waiting 5.5s + (attempt * 1s) guarantees we clear the window and allows a little jitter.
				const delay = 5500 + (attempt * 1000); 
				console.log(`[Sumsub] Encountered 429 Too Many Requests. Retrying attempt ${attempt}/${maxRetries} after ${delay}ms...`);
				await new Promise(resolve => setTimeout(resolve, delay));
				continue;
			}
			throw error;
		}
	}
}

interface ApplicantOperationParams {
	executeFunctions: IExecuteFunctions;
	itemIndex: number;
	apiUrl: string;
	appToken: string;
	appSecret: string;
}

async function createApplicant(params: ApplicantOperationParams): Promise<ApplicantData> {
	const { executeFunctions, itemIndex, ...requestParams } = params;
	const externalUserId = executeFunctions.getNodeParameter('externalUserId', itemIndex) as string;
	const levelName = executeFunctions.getNodeParameter('levelName', itemIndex) as string;
	const additionalFields = executeFunctions.getNodeParameter(
		'additionalFields',
		itemIndex,
		{},
	) as ApplicantAdditionalFields;

	const body: CreateApplicantBody = {
		externalUserId,
		levelName,
	};

	// Add additional fields to the body
	if (additionalFields.email) body.email = additionalFields.email;
	if (additionalFields.phone) body.phone = additionalFields.phone;
	if (additionalFields.sourceKey) body.sourceKey = additionalFields.sourceKey;
	if (additionalFields.creationTrackingData) {
		if (typeof additionalFields.creationTrackingData === 'string') {
			try {
				body.creationTrackingData = JSON.parse(additionalFields.creationTrackingData);
			} catch (error) {
				// Avoid throwing generic json errors, handle silently or omit
			}
		} else {
			body.creationTrackingData = additionalFields.creationTrackingData;
		}
	}

	const path = `/resources/applicants?levelName=${encodeURIComponent(levelName)}`;
	return (await makeRequest({
		executeFunctions,
		method: 'POST',
		path,
		body,
		...requestParams,
	})) as ApplicantData;
}

async function getApplicant(params: ApplicantOperationParams): Promise<ApplicantData> {
	const { executeFunctions, itemIndex, ...requestParams } = params;
	const applicantId = executeFunctions.getNodeParameter('applicantId', itemIndex) as string;
	const path = `/resources/applicants/${applicantId}/one`;
	return (await makeRequest({
		executeFunctions,
		method: 'GET',
		path,
		...requestParams,
	})) as ApplicantData;
}

async function getApplicantReviewHistory(params: ApplicantOperationParams): Promise<IDataObject> {
	const { executeFunctions, itemIndex, ...requestParams } = params;
	const applicantId = executeFunctions.getNodeParameter('applicantId', itemIndex) as string;
	const additionalFields = executeFunctions.getNodeParameter('additionalFields', itemIndex, {}) as {
		levelName?: string;
	};

	let path = `/resources/applicants/${applicantId}/review/history`;
	if (additionalFields.levelName) {
		path += `?levelName=${encodeURIComponent(additionalFields.levelName)}`;
	}

	return (await makeRequest({
		executeFunctions,
		method: 'GET',
		path,
		...requestParams,
	})) as IDataObject;
}

async function getApplicantReviewStatus(params: ApplicantOperationParams): Promise<IDataObject> {
	const { executeFunctions, itemIndex, ...requestParams } = params;
	const applicantId = executeFunctions.getNodeParameter('applicantId', itemIndex) as string;
	const path = `/resources/applicants/${applicantId}/review/status`;
	return (await makeRequest({
		executeFunctions,
		method: 'GET',
		path,
		...requestParams,
	})) as IDataObject;
}

async function getApplicantStatus(params: ApplicantOperationParams): Promise<ApplicantReview> {
	const { executeFunctions, itemIndex, ...requestParams } = params;
	const applicantId = executeFunctions.getNodeParameter('applicantId', itemIndex) as string;
	const path = `/resources/applicants/${applicantId}/status`;
	return (await makeRequest({
		executeFunctions,
		method: 'GET',
		path,
		...requestParams,
	})) as ApplicantReview;
}

async function updateApplicant(params: ApplicantOperationParams): Promise<ApplicantData> {
	const { executeFunctions, itemIndex, ...requestParams } = params;
	const applicantId = executeFunctions.getNodeParameter('applicantId', itemIndex) as string;
	const updateFields = executeFunctions.getNodeParameter(
		'updateFields',
		itemIndex,
		{},
	) as ApplicantUpdateFields;

	const body: UpdateApplicantBody = {};

	if (updateFields.email) body.email = updateFields.email;
	if (updateFields.phone) body.phone = updateFields.phone;
	if (updateFields.firstName) body.firstName = updateFields.firstName;
	if (updateFields.lastName) body.lastName = updateFields.lastName;

	const path = `/resources/applicants/${applicantId}/info`;
	return (await makeRequest({
		executeFunctions,
		method: 'PATCH',
		path,
		body,
		...requestParams,
	})) as ApplicantData;
}

async function generateWebsdkLink(params: ApplicantOperationParams): Promise<WebsdkLinkResponse> {
	const { executeFunctions, itemIndex, ...requestParams } = params;
	const levelName = executeFunctions.getNodeParameter('levelName', itemIndex) as string;
	const userId = executeFunctions.getNodeParameter('userId', itemIndex) as string;
	const additionalFields = executeFunctions.getNodeParameter('additionalFields', itemIndex, {}) as {
		email?: string;
		phone?: string;
		ttlInSecs?: number;
		externalActionId?: string;
	};

	const body: GenerateWebsdkLinkBody = {
		levelName,
		userId,
	};

	if (additionalFields.email || additionalFields.phone) {
		body.applicantIdentifiers = {};
		if (additionalFields.email) body.applicantIdentifiers.email = additionalFields.email;
		if (additionalFields.phone) body.applicantIdentifiers.phone = additionalFields.phone;
	}

	if (additionalFields.ttlInSecs) body.ttlInSecs = additionalFields.ttlInSecs;
	if (additionalFields.externalActionId) body.externalActionId = additionalFields.externalActionId;

	const path = `/resources/sdkIntegrations/levels/-/websdkLink`;
	return (await makeRequest({
		executeFunctions,
		method: 'POST',
		path,
		body,
		...requestParams,
	})) as WebsdkLinkResponse;
}

async function addApplicantTags(params: ApplicantOperationParams): Promise<IDataObject> {
	const { executeFunctions, itemIndex, ...requestParams } = params;
	const applicantId = executeFunctions.getNodeParameter('applicantId', itemIndex) as string;
	const tagsData = executeFunctions.getNodeParameter('tags', itemIndex, {}) as {
		tagList?: Array<{ tagName: string }>;
	};

	const tags: string[] = [];
	if (tagsData.tagList) {
		tagsData.tagList.forEach((item) => {
			if (item.tagName) {
				tags.push(item.tagName);
			}
		});
	}

	const path = `/resources/applicants/${applicantId}/tags/add`;
	return (await makeRequest({
		executeFunctions,
		method: 'POST',
		path,
		body: tags,
		...requestParams,
	})) as IDataObject;
}

async function changeProfileData(params: ApplicantOperationParams): Promise<IDataObject> {
	const { executeFunctions, itemIndex, ...requestParams } = params;
	const applicantId = executeFunctions.getNodeParameter('applicantId', itemIndex) as string;
	const changeFields = executeFunctions.getNodeParameter(
		'changeProfileDataFields',
		itemIndex,
		{},
	) as {
		externalUserId?: string;
		email?: string;
		phone?: string;
		sourceKey?: string;
		lang?: string;
		registrationDate?: string;
	};

	const body: ChangeProfileDataBody = {
		id: applicantId,
	};

	if (changeFields.externalUserId) body.externalUserId = changeFields.externalUserId;
	if (changeFields.email) body.email = changeFields.email;
	if (changeFields.phone) body.phone = changeFields.phone;
	if (changeFields.sourceKey) body.sourceKey = changeFields.sourceKey;
	if (changeFields.lang) body.lang = changeFields.lang;
	if (changeFields.registrationDate) body.registrationDate = changeFields.registrationDate;

	const path = '/resources/applicants';
	return (await makeRequest({
		executeFunctions,
		method: 'PATCH',
		path,
		body,
		...requestParams,
	})) as IDataObject;
}

async function removeApplicantTags(params: ApplicantOperationParams): Promise<IDataObject> {
	const { executeFunctions, itemIndex, ...requestParams } = params;
	const applicantId = executeFunctions.getNodeParameter('applicantId', itemIndex) as string;
	const tagsData = executeFunctions.getNodeParameter('tags', itemIndex, {}) as {
		tagList?: Array<{ tagName: string }>;
	};

	const tags: string[] = [];
	if (tagsData.tagList) {
		tagsData.tagList.forEach((item) => {
			if (item.tagName) {
				tags.push(item.tagName);
			}
		});
	}

	const path = `/resources/applicants/${applicantId}/tags`;
	return (await makeRequest({
		executeFunctions,
		method: 'DELETE',
		path,
		body: tags,
		...requestParams,
	})) as IDataObject;
}

async function getApplicantByExternalId(params: ApplicantOperationParams): Promise<ApplicantData> {
	const { executeFunctions, itemIndex, ...requestParams } = params;
	const externalUserId = executeFunctions.getNodeParameter('externalUserId', itemIndex) as string;
	const path = `/resources/applicants/-;externalUserId=${externalUserId}/one`;
	return (await makeRequest({
		executeFunctions,
		method: 'GET',
		path,
		...requestParams,
	})) as ApplicantData;
}
async function resetVerificationStep(params: ApplicantOperationParams): Promise<IDataObject> {
	const { executeFunctions, itemIndex, ...requestParams } = params;
	const applicantId = executeFunctions.getNodeParameter('applicantId', itemIndex) as string;
	const stepsToReset = executeFunctions.getNodeParameter('stepToReset', itemIndex) as string[];

	const results = [];
	for (const stepToReset of stepsToReset) {
		const path = `/resources/applicants/${applicantId}/resetStep/${stepToReset}`;
		const response = await makeRequest({
			executeFunctions,
			method: 'POST',
			path,
			...requestParams,
		});
		results.push(response);
	}

	return { results };
}

async function addApplicantNote(params: ApplicantOperationParams): Promise<IDataObject> {
	const { executeFunctions, itemIndex, ...requestParams } = params;
	const applicantId = executeFunctions.getNodeParameter('applicantId', itemIndex) as string;
	const note = executeFunctions.getNodeParameter('note', itemIndex) as string;
	const tagsData = executeFunctions.getNodeParameter('tags', itemIndex, {}) as {
		tagList?: Array<{ tagName: string }>;
	};

	const tags: string[] = [];
	if (tagsData.tagList) {
		tagsData.tagList.forEach((item) => {
			if (item.tagName) {
				tags.push(item.tagName);
			}
		});
	}

	const body: IDataObject = {
		applicantId,
		note,
	};

	if (tags.length > 0) {
		body.tags = tags;
	}

	const path = '/resources/api/applicants/notes';
	return (await makeRequest({
		executeFunctions,
		method: 'POST',
		path,
		body,
		...requestParams,
	})) as IDataObject;
}

async function updateApplicantMetadata(params: ApplicantOperationParams): Promise<IDataObject> {
	const { executeFunctions, itemIndex, ...requestParams } = params;
	const applicantId = executeFunctions.getNodeParameter('applicantId', itemIndex) as string;
	const updatesData = executeFunctions.getNodeParameter('metadataUpdates', itemIndex, {}) as {
		updates?: Array<{ key: string; value: string }>;
	};

	// 1. Get current applicant data to retrieve existing metadata
	const getPath = `/resources/applicants/${applicantId}/one`;
	const applicantData = (await makeRequest({
		executeFunctions,
		method: 'GET',
		path: getPath,
		...requestParams,
	})) as ApplicantData;

	const metadata = applicantData.metadata || [];

	// 2. Update existing keys if found
	// If the key is not found, we do NOT add it (as per user request "Update Only")
	if (updatesData.updates) {
		updatesData.updates.forEach((update) => {
			if (update.key) {
				for (const item of metadata) {
					if (item.key === update.key) {
						item.value = update.value || '';
						break;
					}
				}
			}
		});
	}

	// 3. Update the profile with metadata
	const body: ChangeProfileDataBody = {
		id: applicantId,
		metadata: metadata,
	};

	const patchPath = '/resources/applicants';
	return (await makeRequest({
		executeFunctions,
		method: 'PATCH',
		path: patchPath,
		body,
		...requestParams,
	})) as IDataObject;
}

async function removeAllApplicantMetadata(params: ApplicantOperationParams): Promise<IDataObject> {
	const { executeFunctions, itemIndex, ...requestParams } = params;
	const applicantId = executeFunctions.getNodeParameter('applicantId', itemIndex) as string;

	const body: ChangeProfileDataBody = {
		id: applicantId,
		metadata: [],
	};

	const patchPath = '/resources/applicants';
	return (await makeRequest({
		executeFunctions,
		method: 'PATCH',
		path: patchPath,
		body,
		...requestParams,
	})) as IDataObject;
}

async function changeApplicantStatusToInit(params: ApplicantOperationParams): Promise<IDataObject> {
	const { executeFunctions, itemIndex, ...requestParams } = params;
	const applicantId = executeFunctions.getNodeParameter('applicantId', itemIndex) as string;
	const note = executeFunctions.getNodeParameter('note', itemIndex, '') as string;
	const tagsData = executeFunctions.getNodeParameter('tags', itemIndex, {}) as {
		tagList?: Array<{ tagName: string }>;
	};
	const reasonsData = executeFunctions.getNodeParameter('reasons', itemIndex, {}) as {
		reasonsList?: Array<{
			category: string;
			manualCode?: string;
			fraudCode?: string;
			financeCode?: string;
			regulationCode?: string;
			abuseCode?: string;
			deviceCode?: string;
		}>;
	};

	const body: ChangeStatusToInitBody = {};

	if (note) {
		body.note = note;
	}

	if (tagsData.tagList) {
		const tags: string[] = [];
		tagsData.tagList.forEach((item) => {
			if (item.tagName) {
				tags.push(item.tagName);
			}
		});
		if (tags.length > 0) {
			body.tags = tags;
		}
	}

	if (reasonsData.reasonsList) {
		const reasons: { [key: string]: string[] } = {};
		reasonsData.reasonsList.forEach((item) => {
			const category = item.category;
			let code = '';
			if (category === 'manual') code = item.manualCode || '';
			else if (category === 'fraud') code = item.fraudCode || '';
			else if (category === 'finance') code = item.financeCode || '';
			else if (category === 'regulation') code = item.regulationCode || '';
			else if (category === 'abuse') code = item.abuseCode || '';
			else if (category === 'device') code = item.deviceCode || '';

			if (category && code) {
				if (!reasons[category]) {
					reasons[category] = [];
				}
				reasons[category].push(code);
			}
		});
		if (Object.keys(reasons).length > 0) {
			body.reasons = reasons;
		}
	}

	const path = `/resources/applicants/${applicantId}/-/init`;
	return (await makeRequest({
		executeFunctions,
		method: 'POST',
		path,
		body,
		...requestParams,
	})) as IDataObject;
}

async function removeApplicantMetadataKey(params: ApplicantOperationParams): Promise<IDataObject> {
	const { executeFunctions, itemIndex, ...requestParams } = params;
	const applicantId = executeFunctions.getNodeParameter('applicantId', itemIndex) as string;
	const keysData = executeFunctions.getNodeParameter('keysToRemove', itemIndex, {}) as {
		keyList?: Array<{ keyName: string }>;
	};

	const keysToRemove: string[] = [];
	if (keysData.keyList) {
		keysData.keyList.forEach((item) => {
			if (item.keyName) {
				keysToRemove.push(item.keyName);
			}
		});
	}

	// 1. Get current applicant data
	const getPath = `/resources/applicants/${applicantId}/one`;
	const applicantData = (await makeRequest({
		executeFunctions,
		method: 'GET',
		path: getPath,
		...requestParams,
	})) as ApplicantData;

	const currentMetadata = applicantData.metadata || [];

	// 2. Filter out the keys to remove
	const newMetadata = currentMetadata.filter((item) => !keysToRemove.includes(item.key));

	// 3. Update the profile
	const body: ChangeProfileDataBody = {
		id: applicantId,
		metadata: newMetadata,
	};

	const patchPath = '/resources/applicants';
	return (await makeRequest({
		executeFunctions,
		method: 'PATCH',
		path: patchPath,
		body,
		...requestParams,
	})) as IDataObject;
}

async function changeApplicantLevel(params: ApplicantOperationParams): Promise<IDataObject> {
	const { executeFunctions, itemIndex, ...requestParams } = params;
	const applicantId = executeFunctions.getNodeParameter('applicantId', itemIndex) as string;
	const newLevelName = executeFunctions.getNodeParameter('newLevelName', itemIndex) as string;
	const resetVerificationSteps = executeFunctions.getNodeParameter(
		'resetVerificationSteps',
		itemIndex,
		false,
	) as boolean;

	const query: IDataObject = {
		name: newLevelName,
	};
	if (resetVerificationSteps) {
		query.resetVerificationSteps = true;
	}

	const path = `/resources/applicants/${applicantId}/moveToLevel`;
	return (await makeRequest({
		executeFunctions,
		method: 'POST',
		path,
		qs: query,
		...requestParams,
	})) as IDataObject;
}

async function addApplicantMetadata(params: ApplicantOperationParams): Promise<IDataObject> {
	const { executeFunctions, itemIndex, ...requestParams } = params;
	const applicantId = executeFunctions.getNodeParameter('applicantId', itemIndex) as string;
	const updatesData = executeFunctions.getNodeParameter('metadataUpdates', itemIndex, {}) as {
		updates?: Array<{ key: string; value: string }>;
	};

	// 1. Get current applicant data
	const getPath = `/resources/applicants/${applicantId}/one`;
	const applicantData = (await makeRequest({
		executeFunctions,
		method: 'GET',
		path: getPath,
		...requestParams,
	})) as ApplicantData;

	const metadata = applicantData.metadata || [];

	// 2. Iterate input updates to Update or Add
	if (updatesData.updates) {
		updatesData.updates.forEach((update) => {
			if (update.key) {
				let found = false;
				for (const item of metadata) {
					if (item.key === update.key) {
						item.value = update.value || '';
						found = true;
						break;
					}
				}
				// If not found, append new key-value pair
				if (!found) {
					metadata.push({
						key: update.key,
						value: update.value || '',
					});
				}
			}
		});
	}

	// 3. Update the profile
	const body: ChangeProfileDataBody = {
		id: applicantId,
		metadata: metadata,
	};

	const patchPath = '/resources/applicants';
	return (await makeRequest({
		executeFunctions,
		method: 'PATCH',
		path: patchPath,
		body,
		...requestParams,
	})) as IDataObject;
}

async function changeProvidedInfo(params: ApplicantOperationParams): Promise<ApplicantData> {
	const { executeFunctions, itemIndex, ...requestParams } = params;
	const applicantId = executeFunctions.getNodeParameter('applicantId', itemIndex) as string;
	const fixedInfo = executeFunctions.getNodeParameter('fixedInfo', itemIndex, {}) as ApplicantInfo;

	const body: ApplicantInfo = {};
	if (fixedInfo.firstName) body.firstName = fixedInfo.firstName;
	if (fixedInfo.lastName) body.lastName = fixedInfo.lastName;
	if (fixedInfo.middleName) body.middleName = fixedInfo.middleName;
	if (fixedInfo.legalName) body.legalName = fixedInfo.legalName;
	if (fixedInfo.gender) body.gender = fixedInfo.gender;
	if (fixedInfo.dob) body.dob = fixedInfo.dob;
	if (fixedInfo.placeOfBirth) body.placeOfBirth = fixedInfo.placeOfBirth;
	if (fixedInfo.countryOfBirth) body.countryOfBirth = fixedInfo.countryOfBirth;
	if (fixedInfo.stateOfBirth) body.stateOfBirth = fixedInfo.stateOfBirth;
	if (fixedInfo.country) body.country = fixedInfo.country;
	if (fixedInfo.nationality) body.nationality = fixedInfo.nationality;

	const path = `/resources/applicants/${applicantId}/fixedInfo`;
	return (await makeRequest({
		executeFunctions,
		method: 'PATCH',
		path,
		body,
		...requestParams,
	})) as ApplicantData;
}

async function getApplicantLevels(params: ApplicantOperationParams): Promise<IDataObject> {
	const { executeFunctions, ...requestParams } = params;
	const path = '/resources/applicants/-/levels';
	return (await makeRequest({
		executeFunctions,
		method: 'GET',
		path,
		...requestParams,
	})) as IDataObject;
}

async function deactivateApplicant(params: ApplicantOperationParams): Promise<IDataObject> {
	const { executeFunctions, itemIndex, ...requestParams } = params;
	const applicantId = executeFunctions.getNodeParameter('applicantId', itemIndex) as string;
	const path = `/resources/applicants/${applicantId}/presence/deactivated`;
	return (await makeRequest({
		executeFunctions,
		method: 'PATCH',
		path,
		...requestParams,
	})) as IDataObject;
}

async function sendEmailToBeneficiaries(params: ApplicantOperationParams): Promise<IDataObject> {
	const { executeFunctions, itemIndex, ...requestParams } = params;
	const applicantId = executeFunctions.getNodeParameter('applicantId', itemIndex) as string;
	const path = `/resources/applicants/${applicantId}/verificationStatusEmailToBeneficiaries`;
	return (await makeRequest({
		executeFunctions,
		method: 'POST',
		path,
		...requestParams,
	})) as IDataObject;
}

async function deleteTransaction(params: ApplicantOperationParams): Promise<IDataObject> {
	const { executeFunctions, itemIndex, ...requestParams } = params;
	const txnId = executeFunctions.getNodeParameter('txnId', itemIndex) as string;
	const path = `/resources/kyt/txns/${txnId}`;
	return (await makeRequest({
		executeFunctions,
		method: 'DELETE',
		path,
		...requestParams,
	})) as IDataObject;
}

async function getTransaction(params: ApplicantOperationParams): Promise<IDataObject> {
	const { executeFunctions, itemIndex, ...requestParams } = params;
	const txnId = executeFunctions.getNodeParameter('txnId', itemIndex) as string;
	const path = `/resources/kyt/txns/${txnId}`;
	return (await makeRequest({
		executeFunctions,
		method: 'GET',
		path,
		...requestParams,
	})) as IDataObject;
}

async function getTransactionTags(params: ApplicantOperationParams): Promise<IDataObject> {
	const { executeFunctions, itemIndex, ...requestParams } = params;
	const txnId = executeFunctions.getNodeParameter('txnId', itemIndex) as string;
	const path = `/resources/kyt/txns/${txnId}/tags`;
	const response = await makeRequest({
		executeFunctions,
		method: 'GET',
		path,
		...requestParams,
	});
	if (Array.isArray(response)) {
		return { tags: response } as IDataObject;
	}
	return response as IDataObject;
}
