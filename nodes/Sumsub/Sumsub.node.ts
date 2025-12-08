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
				} else {
					throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`);
				}

				returnData.push({
					json: responseData,
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
}

async function makeRequest(params: MakeRequestParams): Promise<SumsubApiResponse> {
	const { executeFunctions, method, path, apiUrl, appToken, appSecret, body } = params;
	const timestamp = Math.floor(Date.now() / 1000);
	const bodyString = body ? JSON.stringify(body) : '';
	const signature = createSignature({ method, path, timestamp, body: bodyString, appSecret });

	const options: IHttpRequestOptions = {
		method,
		url: path,
		baseURL: apiUrl,
		headers: {
			'Content-Type': 'application/json',
			'X-App-Token': appToken,
			'X-App-Access-Sig': signature,
			'X-App-Access-Ts': timestamp.toString(),
		},
		json: true,
	};

	if (body) {
		options.body = body;
	}

	return await executeFunctions.helpers.request(options);
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
	};
	const metadata = executeFunctions.getNodeParameter('metadata', itemIndex, {}) as {
		metadataValues?: Array<{ key: string; value: string }>;
	};

	const body: ChangeProfileDataBody = {
		id: applicantId,
	};

	if (changeFields.externalUserId) body.externalUserId = changeFields.externalUserId;
	if (changeFields.email) body.email = changeFields.email;
	if (changeFields.phone) body.phone = changeFields.phone;
	if (changeFields.sourceKey) body.sourceKey = changeFields.sourceKey;
	if (changeFields.lang) body.lang = changeFields.lang;

	if (metadata.metadataValues) {
		body.metadata = metadata.metadataValues;
	}

	const path = '/resources/applicants';
	return (await makeRequest({
		executeFunctions,
		method: 'PATCH',
		path,
		body,
		...requestParams,
	})) as IDataObject;
}
