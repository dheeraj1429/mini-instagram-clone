import mongodb from 'mongodb';
import {
  Aggregate,
  AggregateOptions,
  ClientSession,
  Model,
  MongooseBaseQueryOptions,
  MongooseUpdateQueryOptions,
  PipelineStage,
  ProjectionType,
  QueryOptions,
  Types,
  UpdateQuery,
  UpdateWithAggregationPipeline,
  UpdateWriteOpResult,
} from 'mongoose';
import { AbstractDocument } from './abstract.schema';

import { QuerySelector, RootQuerySelector } from 'mongoose';

type RepositoryFilterQuery<T> = {
  [P in keyof T]?: T[P] | QuerySelector<T[P]>;
} & RootQuerySelector<T>;

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  constructor(protected readonly model: Model<TDocument>) {}

  async create(
    document: Omit<TDocument, '_id'>,
    session?: ClientSession | null,
  ): Promise<TDocument> {
    const createDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createDocument.save({ session })).toJSON() as TDocument;
  }

  async findOne(
    filterQuery: RepositoryFilterQuery<TDocument>,
    projection?: ProjectionType<TDocument> | null,
    options?: QueryOptions<TDocument> | null,
  ): Promise<TDocument | null> {
    return await this.model
      .findOne(filterQuery, projection, options)
      .lean<TDocument>(true);
  }

  async findOneAndUpdate(
    filterQuery: RepositoryFilterQuery<TDocument>,
    update?: UpdateQuery<TDocument>,
    options?: QueryOptions<TDocument> | null,
  ): Promise<TDocument> {
    return await this.model
      .findOneAndUpdate(filterQuery, update, { new: true, ...options })
      .lean<TDocument>(true);
  }

  async deleteMany(
    filter?: RepositoryFilterQuery<TDocument>,
    options?:
      | (mongodb.DeleteOptions & MongooseBaseQueryOptions<TDocument>)
      | null,
  ): Promise<mongodb.DeleteResult> {
    return await this.model.deleteMany(filter, options);
  }

  async deleteOne(
    filter?: RepositoryFilterQuery<TDocument>,
    options?:
      | (mongodb.DeleteOptions & MongooseBaseQueryOptions<TDocument>)
      | null,
  ): Promise<mongodb.DeleteResult> {
    return await this.model.deleteOne(filter, options);
  }

  async updateOne(
    filterQuery: RepositoryFilterQuery<TDocument>,
    update?: UpdateQuery<TDocument>,
    options?:
      | (mongodb.UpdateOptions & MongooseUpdateQueryOptions<TDocument>)
      | null,
  ): Promise<TDocument> {
    return await this.model
      .updateOne(filterQuery, update, options)
      .lean<TDocument>(true);
  }

  async updateMany(
    filter: RepositoryFilterQuery<TDocument>,
    update?: UpdateQuery<TDocument> | UpdateWithAggregationPipeline,
    options?:
      | (mongodb.UpdateOptions & MongooseUpdateQueryOptions<TDocument>)
      | null,
  ): Promise<UpdateWriteOpResult> {
    return await this.model.updateMany(filter, update, options).lean(true);
  }

  async findAll(
    filterQuery: RepositoryFilterQuery<TDocument>,
    projection?: ProjectionType<TDocument> | null | undefined,
    options?: QueryOptions<TDocument> | null | undefined,
  ): Promise<TDocument[]> {
    return this.model
      .find(filterQuery, projection, options)
      .lean<TDocument[]>(true);
  }

  async findOneAndDelete(
    filterQuery: RepositoryFilterQuery<TDocument>,
    options?: QueryOptions<TDocument> | null,
  ): Promise<TDocument> {
    return await this.model
      .findOneAndDelete(filterQuery, options)
      .lean<TDocument>(true);
  }

  async aggregate<T>(
    pipeline?: PipelineStage[],
    options?: AggregateOptions,
  ): Promise<Aggregate<T[]>> {
    return await this.model.aggregate(pipeline, options);
  }

  async countDocuments(
    filter?: RepositoryFilterQuery<TDocument>,
    options?:
      | (mongodb.CountOptions & MongooseBaseQueryOptions<TDocument>)
      | null,
  ) {
    return await this.model.countDocuments(filter, options);
  }
}
