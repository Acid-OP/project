
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model OhlcvCandle
 * 
 */
export type OhlcvCandle = $Result.DefaultSelection<Prisma.$OhlcvCandlePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more OhlcvCandles
 * const ohlcvCandles = await prisma.ohlcvCandle.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more OhlcvCandles
   * const ohlcvCandles = await prisma.ohlcvCandle.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.ohlcvCandle`: Exposes CRUD operations for the **OhlcvCandle** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OhlcvCandles
    * const ohlcvCandles = await prisma.ohlcvCandle.findMany()
    * ```
    */
  get ohlcvCandle(): Prisma.OhlcvCandleDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.13.0
   * Query Engine version: 361e86d0ea4987e9f53a565309b3eed797a6bcbd
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    OhlcvCandle: 'OhlcvCandle'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    timescaleDb?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "ohlcvCandle"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      OhlcvCandle: {
        payload: Prisma.$OhlcvCandlePayload<ExtArgs>
        fields: Prisma.OhlcvCandleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OhlcvCandleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OhlcvCandlePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OhlcvCandleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OhlcvCandlePayload>
          }
          findFirst: {
            args: Prisma.OhlcvCandleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OhlcvCandlePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OhlcvCandleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OhlcvCandlePayload>
          }
          findMany: {
            args: Prisma.OhlcvCandleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OhlcvCandlePayload>[]
          }
          create: {
            args: Prisma.OhlcvCandleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OhlcvCandlePayload>
          }
          createMany: {
            args: Prisma.OhlcvCandleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OhlcvCandleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OhlcvCandlePayload>[]
          }
          delete: {
            args: Prisma.OhlcvCandleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OhlcvCandlePayload>
          }
          update: {
            args: Prisma.OhlcvCandleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OhlcvCandlePayload>
          }
          deleteMany: {
            args: Prisma.OhlcvCandleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OhlcvCandleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OhlcvCandleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OhlcvCandlePayload>[]
          }
          upsert: {
            args: Prisma.OhlcvCandleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OhlcvCandlePayload>
          }
          aggregate: {
            args: Prisma.OhlcvCandleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOhlcvCandle>
          }
          groupBy: {
            args: Prisma.OhlcvCandleGroupByArgs<ExtArgs>
            result: $Utils.Optional<OhlcvCandleGroupByOutputType>[]
          }
          count: {
            args: Prisma.OhlcvCandleCountArgs<ExtArgs>
            result: $Utils.Optional<OhlcvCandleCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    ohlcvCandle?: OhlcvCandleOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model OhlcvCandle
   */

  export type AggregateOhlcvCandle = {
    _count: OhlcvCandleCountAggregateOutputType | null
    _avg: OhlcvCandleAvgAggregateOutputType | null
    _sum: OhlcvCandleSumAggregateOutputType | null
    _min: OhlcvCandleMinAggregateOutputType | null
    _max: OhlcvCandleMaxAggregateOutputType | null
  }

  export type OhlcvCandleAvgAggregateOutputType = {
    id: number | null
    openTime: number | null
    closeTime: number | null
    open: Decimal | null
    high: Decimal | null
    low: Decimal | null
    close: Decimal | null
    volume: Decimal | null
    trades: number | null
  }

  export type OhlcvCandleSumAggregateOutputType = {
    id: bigint | null
    openTime: bigint | null
    closeTime: bigint | null
    open: Decimal | null
    high: Decimal | null
    low: Decimal | null
    close: Decimal | null
    volume: Decimal | null
    trades: number | null
  }

  export type OhlcvCandleMinAggregateOutputType = {
    id: bigint | null
    symbol: string | null
    interval: string | null
    openTime: bigint | null
    closeTime: bigint | null
    open: Decimal | null
    high: Decimal | null
    low: Decimal | null
    close: Decimal | null
    volume: Decimal | null
    trades: number | null
    createdAt: Date | null
  }

  export type OhlcvCandleMaxAggregateOutputType = {
    id: bigint | null
    symbol: string | null
    interval: string | null
    openTime: bigint | null
    closeTime: bigint | null
    open: Decimal | null
    high: Decimal | null
    low: Decimal | null
    close: Decimal | null
    volume: Decimal | null
    trades: number | null
    createdAt: Date | null
  }

  export type OhlcvCandleCountAggregateOutputType = {
    id: number
    symbol: number
    interval: number
    openTime: number
    closeTime: number
    open: number
    high: number
    low: number
    close: number
    volume: number
    trades: number
    createdAt: number
    _all: number
  }


  export type OhlcvCandleAvgAggregateInputType = {
    id?: true
    openTime?: true
    closeTime?: true
    open?: true
    high?: true
    low?: true
    close?: true
    volume?: true
    trades?: true
  }

  export type OhlcvCandleSumAggregateInputType = {
    id?: true
    openTime?: true
    closeTime?: true
    open?: true
    high?: true
    low?: true
    close?: true
    volume?: true
    trades?: true
  }

  export type OhlcvCandleMinAggregateInputType = {
    id?: true
    symbol?: true
    interval?: true
    openTime?: true
    closeTime?: true
    open?: true
    high?: true
    low?: true
    close?: true
    volume?: true
    trades?: true
    createdAt?: true
  }

  export type OhlcvCandleMaxAggregateInputType = {
    id?: true
    symbol?: true
    interval?: true
    openTime?: true
    closeTime?: true
    open?: true
    high?: true
    low?: true
    close?: true
    volume?: true
    trades?: true
    createdAt?: true
  }

  export type OhlcvCandleCountAggregateInputType = {
    id?: true
    symbol?: true
    interval?: true
    openTime?: true
    closeTime?: true
    open?: true
    high?: true
    low?: true
    close?: true
    volume?: true
    trades?: true
    createdAt?: true
    _all?: true
  }

  export type OhlcvCandleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OhlcvCandle to aggregate.
     */
    where?: OhlcvCandleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OhlcvCandles to fetch.
     */
    orderBy?: OhlcvCandleOrderByWithRelationInput | OhlcvCandleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OhlcvCandleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OhlcvCandles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OhlcvCandles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OhlcvCandles
    **/
    _count?: true | OhlcvCandleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OhlcvCandleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OhlcvCandleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OhlcvCandleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OhlcvCandleMaxAggregateInputType
  }

  export type GetOhlcvCandleAggregateType<T extends OhlcvCandleAggregateArgs> = {
        [P in keyof T & keyof AggregateOhlcvCandle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOhlcvCandle[P]>
      : GetScalarType<T[P], AggregateOhlcvCandle[P]>
  }




  export type OhlcvCandleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OhlcvCandleWhereInput
    orderBy?: OhlcvCandleOrderByWithAggregationInput | OhlcvCandleOrderByWithAggregationInput[]
    by: OhlcvCandleScalarFieldEnum[] | OhlcvCandleScalarFieldEnum
    having?: OhlcvCandleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OhlcvCandleCountAggregateInputType | true
    _avg?: OhlcvCandleAvgAggregateInputType
    _sum?: OhlcvCandleSumAggregateInputType
    _min?: OhlcvCandleMinAggregateInputType
    _max?: OhlcvCandleMaxAggregateInputType
  }

  export type OhlcvCandleGroupByOutputType = {
    id: bigint
    symbol: string
    interval: string
    openTime: bigint
    closeTime: bigint
    open: Decimal
    high: Decimal
    low: Decimal
    close: Decimal
    volume: Decimal
    trades: number
    createdAt: Date
    _count: OhlcvCandleCountAggregateOutputType | null
    _avg: OhlcvCandleAvgAggregateOutputType | null
    _sum: OhlcvCandleSumAggregateOutputType | null
    _min: OhlcvCandleMinAggregateOutputType | null
    _max: OhlcvCandleMaxAggregateOutputType | null
  }

  type GetOhlcvCandleGroupByPayload<T extends OhlcvCandleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OhlcvCandleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OhlcvCandleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OhlcvCandleGroupByOutputType[P]>
            : GetScalarType<T[P], OhlcvCandleGroupByOutputType[P]>
        }
      >
    >


  export type OhlcvCandleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    symbol?: boolean
    interval?: boolean
    openTime?: boolean
    closeTime?: boolean
    open?: boolean
    high?: boolean
    low?: boolean
    close?: boolean
    volume?: boolean
    trades?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["ohlcvCandle"]>

  export type OhlcvCandleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    symbol?: boolean
    interval?: boolean
    openTime?: boolean
    closeTime?: boolean
    open?: boolean
    high?: boolean
    low?: boolean
    close?: boolean
    volume?: boolean
    trades?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["ohlcvCandle"]>

  export type OhlcvCandleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    symbol?: boolean
    interval?: boolean
    openTime?: boolean
    closeTime?: boolean
    open?: boolean
    high?: boolean
    low?: boolean
    close?: boolean
    volume?: boolean
    trades?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["ohlcvCandle"]>

  export type OhlcvCandleSelectScalar = {
    id?: boolean
    symbol?: boolean
    interval?: boolean
    openTime?: boolean
    closeTime?: boolean
    open?: boolean
    high?: boolean
    low?: boolean
    close?: boolean
    volume?: boolean
    trades?: boolean
    createdAt?: boolean
  }

  export type OhlcvCandleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "symbol" | "interval" | "openTime" | "closeTime" | "open" | "high" | "low" | "close" | "volume" | "trades" | "createdAt", ExtArgs["result"]["ohlcvCandle"]>

  export type $OhlcvCandlePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OhlcvCandle"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      symbol: string
      interval: string
      openTime: bigint
      closeTime: bigint
      open: Prisma.Decimal
      high: Prisma.Decimal
      low: Prisma.Decimal
      close: Prisma.Decimal
      volume: Prisma.Decimal
      trades: number
      createdAt: Date
    }, ExtArgs["result"]["ohlcvCandle"]>
    composites: {}
  }

  type OhlcvCandleGetPayload<S extends boolean | null | undefined | OhlcvCandleDefaultArgs> = $Result.GetResult<Prisma.$OhlcvCandlePayload, S>

  type OhlcvCandleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OhlcvCandleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OhlcvCandleCountAggregateInputType | true
    }

  export interface OhlcvCandleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OhlcvCandle'], meta: { name: 'OhlcvCandle' } }
    /**
     * Find zero or one OhlcvCandle that matches the filter.
     * @param {OhlcvCandleFindUniqueArgs} args - Arguments to find a OhlcvCandle
     * @example
     * // Get one OhlcvCandle
     * const ohlcvCandle = await prisma.ohlcvCandle.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OhlcvCandleFindUniqueArgs>(args: SelectSubset<T, OhlcvCandleFindUniqueArgs<ExtArgs>>): Prisma__OhlcvCandleClient<$Result.GetResult<Prisma.$OhlcvCandlePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OhlcvCandle that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OhlcvCandleFindUniqueOrThrowArgs} args - Arguments to find a OhlcvCandle
     * @example
     * // Get one OhlcvCandle
     * const ohlcvCandle = await prisma.ohlcvCandle.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OhlcvCandleFindUniqueOrThrowArgs>(args: SelectSubset<T, OhlcvCandleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OhlcvCandleClient<$Result.GetResult<Prisma.$OhlcvCandlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OhlcvCandle that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OhlcvCandleFindFirstArgs} args - Arguments to find a OhlcvCandle
     * @example
     * // Get one OhlcvCandle
     * const ohlcvCandle = await prisma.ohlcvCandle.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OhlcvCandleFindFirstArgs>(args?: SelectSubset<T, OhlcvCandleFindFirstArgs<ExtArgs>>): Prisma__OhlcvCandleClient<$Result.GetResult<Prisma.$OhlcvCandlePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OhlcvCandle that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OhlcvCandleFindFirstOrThrowArgs} args - Arguments to find a OhlcvCandle
     * @example
     * // Get one OhlcvCandle
     * const ohlcvCandle = await prisma.ohlcvCandle.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OhlcvCandleFindFirstOrThrowArgs>(args?: SelectSubset<T, OhlcvCandleFindFirstOrThrowArgs<ExtArgs>>): Prisma__OhlcvCandleClient<$Result.GetResult<Prisma.$OhlcvCandlePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OhlcvCandles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OhlcvCandleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OhlcvCandles
     * const ohlcvCandles = await prisma.ohlcvCandle.findMany()
     * 
     * // Get first 10 OhlcvCandles
     * const ohlcvCandles = await prisma.ohlcvCandle.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ohlcvCandleWithIdOnly = await prisma.ohlcvCandle.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OhlcvCandleFindManyArgs>(args?: SelectSubset<T, OhlcvCandleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OhlcvCandlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OhlcvCandle.
     * @param {OhlcvCandleCreateArgs} args - Arguments to create a OhlcvCandle.
     * @example
     * // Create one OhlcvCandle
     * const OhlcvCandle = await prisma.ohlcvCandle.create({
     *   data: {
     *     // ... data to create a OhlcvCandle
     *   }
     * })
     * 
     */
    create<T extends OhlcvCandleCreateArgs>(args: SelectSubset<T, OhlcvCandleCreateArgs<ExtArgs>>): Prisma__OhlcvCandleClient<$Result.GetResult<Prisma.$OhlcvCandlePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OhlcvCandles.
     * @param {OhlcvCandleCreateManyArgs} args - Arguments to create many OhlcvCandles.
     * @example
     * // Create many OhlcvCandles
     * const ohlcvCandle = await prisma.ohlcvCandle.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OhlcvCandleCreateManyArgs>(args?: SelectSubset<T, OhlcvCandleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OhlcvCandles and returns the data saved in the database.
     * @param {OhlcvCandleCreateManyAndReturnArgs} args - Arguments to create many OhlcvCandles.
     * @example
     * // Create many OhlcvCandles
     * const ohlcvCandle = await prisma.ohlcvCandle.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OhlcvCandles and only return the `id`
     * const ohlcvCandleWithIdOnly = await prisma.ohlcvCandle.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OhlcvCandleCreateManyAndReturnArgs>(args?: SelectSubset<T, OhlcvCandleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OhlcvCandlePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OhlcvCandle.
     * @param {OhlcvCandleDeleteArgs} args - Arguments to delete one OhlcvCandle.
     * @example
     * // Delete one OhlcvCandle
     * const OhlcvCandle = await prisma.ohlcvCandle.delete({
     *   where: {
     *     // ... filter to delete one OhlcvCandle
     *   }
     * })
     * 
     */
    delete<T extends OhlcvCandleDeleteArgs>(args: SelectSubset<T, OhlcvCandleDeleteArgs<ExtArgs>>): Prisma__OhlcvCandleClient<$Result.GetResult<Prisma.$OhlcvCandlePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OhlcvCandle.
     * @param {OhlcvCandleUpdateArgs} args - Arguments to update one OhlcvCandle.
     * @example
     * // Update one OhlcvCandle
     * const ohlcvCandle = await prisma.ohlcvCandle.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OhlcvCandleUpdateArgs>(args: SelectSubset<T, OhlcvCandleUpdateArgs<ExtArgs>>): Prisma__OhlcvCandleClient<$Result.GetResult<Prisma.$OhlcvCandlePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OhlcvCandles.
     * @param {OhlcvCandleDeleteManyArgs} args - Arguments to filter OhlcvCandles to delete.
     * @example
     * // Delete a few OhlcvCandles
     * const { count } = await prisma.ohlcvCandle.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OhlcvCandleDeleteManyArgs>(args?: SelectSubset<T, OhlcvCandleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OhlcvCandles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OhlcvCandleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OhlcvCandles
     * const ohlcvCandle = await prisma.ohlcvCandle.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OhlcvCandleUpdateManyArgs>(args: SelectSubset<T, OhlcvCandleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OhlcvCandles and returns the data updated in the database.
     * @param {OhlcvCandleUpdateManyAndReturnArgs} args - Arguments to update many OhlcvCandles.
     * @example
     * // Update many OhlcvCandles
     * const ohlcvCandle = await prisma.ohlcvCandle.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OhlcvCandles and only return the `id`
     * const ohlcvCandleWithIdOnly = await prisma.ohlcvCandle.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OhlcvCandleUpdateManyAndReturnArgs>(args: SelectSubset<T, OhlcvCandleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OhlcvCandlePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OhlcvCandle.
     * @param {OhlcvCandleUpsertArgs} args - Arguments to update or create a OhlcvCandle.
     * @example
     * // Update or create a OhlcvCandle
     * const ohlcvCandle = await prisma.ohlcvCandle.upsert({
     *   create: {
     *     // ... data to create a OhlcvCandle
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OhlcvCandle we want to update
     *   }
     * })
     */
    upsert<T extends OhlcvCandleUpsertArgs>(args: SelectSubset<T, OhlcvCandleUpsertArgs<ExtArgs>>): Prisma__OhlcvCandleClient<$Result.GetResult<Prisma.$OhlcvCandlePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OhlcvCandles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OhlcvCandleCountArgs} args - Arguments to filter OhlcvCandles to count.
     * @example
     * // Count the number of OhlcvCandles
     * const count = await prisma.ohlcvCandle.count({
     *   where: {
     *     // ... the filter for the OhlcvCandles we want to count
     *   }
     * })
    **/
    count<T extends OhlcvCandleCountArgs>(
      args?: Subset<T, OhlcvCandleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OhlcvCandleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OhlcvCandle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OhlcvCandleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OhlcvCandleAggregateArgs>(args: Subset<T, OhlcvCandleAggregateArgs>): Prisma.PrismaPromise<GetOhlcvCandleAggregateType<T>>

    /**
     * Group by OhlcvCandle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OhlcvCandleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OhlcvCandleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OhlcvCandleGroupByArgs['orderBy'] }
        : { orderBy?: OhlcvCandleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OhlcvCandleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOhlcvCandleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OhlcvCandle model
   */
  readonly fields: OhlcvCandleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OhlcvCandle.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OhlcvCandleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OhlcvCandle model
   */
  interface OhlcvCandleFieldRefs {
    readonly id: FieldRef<"OhlcvCandle", 'BigInt'>
    readonly symbol: FieldRef<"OhlcvCandle", 'String'>
    readonly interval: FieldRef<"OhlcvCandle", 'String'>
    readonly openTime: FieldRef<"OhlcvCandle", 'BigInt'>
    readonly closeTime: FieldRef<"OhlcvCandle", 'BigInt'>
    readonly open: FieldRef<"OhlcvCandle", 'Decimal'>
    readonly high: FieldRef<"OhlcvCandle", 'Decimal'>
    readonly low: FieldRef<"OhlcvCandle", 'Decimal'>
    readonly close: FieldRef<"OhlcvCandle", 'Decimal'>
    readonly volume: FieldRef<"OhlcvCandle", 'Decimal'>
    readonly trades: FieldRef<"OhlcvCandle", 'Int'>
    readonly createdAt: FieldRef<"OhlcvCandle", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OhlcvCandle findUnique
   */
  export type OhlcvCandleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OhlcvCandle
     */
    select?: OhlcvCandleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OhlcvCandle
     */
    omit?: OhlcvCandleOmit<ExtArgs> | null
    /**
     * Filter, which OhlcvCandle to fetch.
     */
    where: OhlcvCandleWhereUniqueInput
  }

  /**
   * OhlcvCandle findUniqueOrThrow
   */
  export type OhlcvCandleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OhlcvCandle
     */
    select?: OhlcvCandleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OhlcvCandle
     */
    omit?: OhlcvCandleOmit<ExtArgs> | null
    /**
     * Filter, which OhlcvCandle to fetch.
     */
    where: OhlcvCandleWhereUniqueInput
  }

  /**
   * OhlcvCandle findFirst
   */
  export type OhlcvCandleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OhlcvCandle
     */
    select?: OhlcvCandleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OhlcvCandle
     */
    omit?: OhlcvCandleOmit<ExtArgs> | null
    /**
     * Filter, which OhlcvCandle to fetch.
     */
    where?: OhlcvCandleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OhlcvCandles to fetch.
     */
    orderBy?: OhlcvCandleOrderByWithRelationInput | OhlcvCandleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OhlcvCandles.
     */
    cursor?: OhlcvCandleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OhlcvCandles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OhlcvCandles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OhlcvCandles.
     */
    distinct?: OhlcvCandleScalarFieldEnum | OhlcvCandleScalarFieldEnum[]
  }

  /**
   * OhlcvCandle findFirstOrThrow
   */
  export type OhlcvCandleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OhlcvCandle
     */
    select?: OhlcvCandleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OhlcvCandle
     */
    omit?: OhlcvCandleOmit<ExtArgs> | null
    /**
     * Filter, which OhlcvCandle to fetch.
     */
    where?: OhlcvCandleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OhlcvCandles to fetch.
     */
    orderBy?: OhlcvCandleOrderByWithRelationInput | OhlcvCandleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OhlcvCandles.
     */
    cursor?: OhlcvCandleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OhlcvCandles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OhlcvCandles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OhlcvCandles.
     */
    distinct?: OhlcvCandleScalarFieldEnum | OhlcvCandleScalarFieldEnum[]
  }

  /**
   * OhlcvCandle findMany
   */
  export type OhlcvCandleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OhlcvCandle
     */
    select?: OhlcvCandleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OhlcvCandle
     */
    omit?: OhlcvCandleOmit<ExtArgs> | null
    /**
     * Filter, which OhlcvCandles to fetch.
     */
    where?: OhlcvCandleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OhlcvCandles to fetch.
     */
    orderBy?: OhlcvCandleOrderByWithRelationInput | OhlcvCandleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OhlcvCandles.
     */
    cursor?: OhlcvCandleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OhlcvCandles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OhlcvCandles.
     */
    skip?: number
    distinct?: OhlcvCandleScalarFieldEnum | OhlcvCandleScalarFieldEnum[]
  }

  /**
   * OhlcvCandle create
   */
  export type OhlcvCandleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OhlcvCandle
     */
    select?: OhlcvCandleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OhlcvCandle
     */
    omit?: OhlcvCandleOmit<ExtArgs> | null
    /**
     * The data needed to create a OhlcvCandle.
     */
    data: XOR<OhlcvCandleCreateInput, OhlcvCandleUncheckedCreateInput>
  }

  /**
   * OhlcvCandle createMany
   */
  export type OhlcvCandleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OhlcvCandles.
     */
    data: OhlcvCandleCreateManyInput | OhlcvCandleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OhlcvCandle createManyAndReturn
   */
  export type OhlcvCandleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OhlcvCandle
     */
    select?: OhlcvCandleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OhlcvCandle
     */
    omit?: OhlcvCandleOmit<ExtArgs> | null
    /**
     * The data used to create many OhlcvCandles.
     */
    data: OhlcvCandleCreateManyInput | OhlcvCandleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OhlcvCandle update
   */
  export type OhlcvCandleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OhlcvCandle
     */
    select?: OhlcvCandleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OhlcvCandle
     */
    omit?: OhlcvCandleOmit<ExtArgs> | null
    /**
     * The data needed to update a OhlcvCandle.
     */
    data: XOR<OhlcvCandleUpdateInput, OhlcvCandleUncheckedUpdateInput>
    /**
     * Choose, which OhlcvCandle to update.
     */
    where: OhlcvCandleWhereUniqueInput
  }

  /**
   * OhlcvCandle updateMany
   */
  export type OhlcvCandleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OhlcvCandles.
     */
    data: XOR<OhlcvCandleUpdateManyMutationInput, OhlcvCandleUncheckedUpdateManyInput>
    /**
     * Filter which OhlcvCandles to update
     */
    where?: OhlcvCandleWhereInput
    /**
     * Limit how many OhlcvCandles to update.
     */
    limit?: number
  }

  /**
   * OhlcvCandle updateManyAndReturn
   */
  export type OhlcvCandleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OhlcvCandle
     */
    select?: OhlcvCandleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OhlcvCandle
     */
    omit?: OhlcvCandleOmit<ExtArgs> | null
    /**
     * The data used to update OhlcvCandles.
     */
    data: XOR<OhlcvCandleUpdateManyMutationInput, OhlcvCandleUncheckedUpdateManyInput>
    /**
     * Filter which OhlcvCandles to update
     */
    where?: OhlcvCandleWhereInput
    /**
     * Limit how many OhlcvCandles to update.
     */
    limit?: number
  }

  /**
   * OhlcvCandle upsert
   */
  export type OhlcvCandleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OhlcvCandle
     */
    select?: OhlcvCandleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OhlcvCandle
     */
    omit?: OhlcvCandleOmit<ExtArgs> | null
    /**
     * The filter to search for the OhlcvCandle to update in case it exists.
     */
    where: OhlcvCandleWhereUniqueInput
    /**
     * In case the OhlcvCandle found by the `where` argument doesn't exist, create a new OhlcvCandle with this data.
     */
    create: XOR<OhlcvCandleCreateInput, OhlcvCandleUncheckedCreateInput>
    /**
     * In case the OhlcvCandle was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OhlcvCandleUpdateInput, OhlcvCandleUncheckedUpdateInput>
  }

  /**
   * OhlcvCandle delete
   */
  export type OhlcvCandleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OhlcvCandle
     */
    select?: OhlcvCandleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OhlcvCandle
     */
    omit?: OhlcvCandleOmit<ExtArgs> | null
    /**
     * Filter which OhlcvCandle to delete.
     */
    where: OhlcvCandleWhereUniqueInput
  }

  /**
   * OhlcvCandle deleteMany
   */
  export type OhlcvCandleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OhlcvCandles to delete
     */
    where?: OhlcvCandleWhereInput
    /**
     * Limit how many OhlcvCandles to delete.
     */
    limit?: number
  }

  /**
   * OhlcvCandle without action
   */
  export type OhlcvCandleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OhlcvCandle
     */
    select?: OhlcvCandleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OhlcvCandle
     */
    omit?: OhlcvCandleOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const OhlcvCandleScalarFieldEnum: {
    id: 'id',
    symbol: 'symbol',
    interval: 'interval',
    openTime: 'openTime',
    closeTime: 'closeTime',
    open: 'open',
    high: 'high',
    low: 'low',
    close: 'close',
    volume: 'volume',
    trades: 'trades',
    createdAt: 'createdAt'
  };

  export type OhlcvCandleScalarFieldEnum = (typeof OhlcvCandleScalarFieldEnum)[keyof typeof OhlcvCandleScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type OhlcvCandleWhereInput = {
    AND?: OhlcvCandleWhereInput | OhlcvCandleWhereInput[]
    OR?: OhlcvCandleWhereInput[]
    NOT?: OhlcvCandleWhereInput | OhlcvCandleWhereInput[]
    id?: BigIntFilter<"OhlcvCandle"> | bigint | number
    symbol?: StringFilter<"OhlcvCandle"> | string
    interval?: StringFilter<"OhlcvCandle"> | string
    openTime?: BigIntFilter<"OhlcvCandle"> | bigint | number
    closeTime?: BigIntFilter<"OhlcvCandle"> | bigint | number
    open?: DecimalFilter<"OhlcvCandle"> | Decimal | DecimalJsLike | number | string
    high?: DecimalFilter<"OhlcvCandle"> | Decimal | DecimalJsLike | number | string
    low?: DecimalFilter<"OhlcvCandle"> | Decimal | DecimalJsLike | number | string
    close?: DecimalFilter<"OhlcvCandle"> | Decimal | DecimalJsLike | number | string
    volume?: DecimalFilter<"OhlcvCandle"> | Decimal | DecimalJsLike | number | string
    trades?: IntFilter<"OhlcvCandle"> | number
    createdAt?: DateTimeFilter<"OhlcvCandle"> | Date | string
  }

  export type OhlcvCandleOrderByWithRelationInput = {
    id?: SortOrder
    symbol?: SortOrder
    interval?: SortOrder
    openTime?: SortOrder
    closeTime?: SortOrder
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
    trades?: SortOrder
    createdAt?: SortOrder
  }

  export type OhlcvCandleWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    symbol_interval_openTime?: OhlcvCandleSymbolIntervalOpenTimeCompoundUniqueInput
    AND?: OhlcvCandleWhereInput | OhlcvCandleWhereInput[]
    OR?: OhlcvCandleWhereInput[]
    NOT?: OhlcvCandleWhereInput | OhlcvCandleWhereInput[]
    symbol?: StringFilter<"OhlcvCandle"> | string
    interval?: StringFilter<"OhlcvCandle"> | string
    openTime?: BigIntFilter<"OhlcvCandle"> | bigint | number
    closeTime?: BigIntFilter<"OhlcvCandle"> | bigint | number
    open?: DecimalFilter<"OhlcvCandle"> | Decimal | DecimalJsLike | number | string
    high?: DecimalFilter<"OhlcvCandle"> | Decimal | DecimalJsLike | number | string
    low?: DecimalFilter<"OhlcvCandle"> | Decimal | DecimalJsLike | number | string
    close?: DecimalFilter<"OhlcvCandle"> | Decimal | DecimalJsLike | number | string
    volume?: DecimalFilter<"OhlcvCandle"> | Decimal | DecimalJsLike | number | string
    trades?: IntFilter<"OhlcvCandle"> | number
    createdAt?: DateTimeFilter<"OhlcvCandle"> | Date | string
  }, "id" | "symbol_interval_openTime">

  export type OhlcvCandleOrderByWithAggregationInput = {
    id?: SortOrder
    symbol?: SortOrder
    interval?: SortOrder
    openTime?: SortOrder
    closeTime?: SortOrder
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
    trades?: SortOrder
    createdAt?: SortOrder
    _count?: OhlcvCandleCountOrderByAggregateInput
    _avg?: OhlcvCandleAvgOrderByAggregateInput
    _max?: OhlcvCandleMaxOrderByAggregateInput
    _min?: OhlcvCandleMinOrderByAggregateInput
    _sum?: OhlcvCandleSumOrderByAggregateInput
  }

  export type OhlcvCandleScalarWhereWithAggregatesInput = {
    AND?: OhlcvCandleScalarWhereWithAggregatesInput | OhlcvCandleScalarWhereWithAggregatesInput[]
    OR?: OhlcvCandleScalarWhereWithAggregatesInput[]
    NOT?: OhlcvCandleScalarWhereWithAggregatesInput | OhlcvCandleScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"OhlcvCandle"> | bigint | number
    symbol?: StringWithAggregatesFilter<"OhlcvCandle"> | string
    interval?: StringWithAggregatesFilter<"OhlcvCandle"> | string
    openTime?: BigIntWithAggregatesFilter<"OhlcvCandle"> | bigint | number
    closeTime?: BigIntWithAggregatesFilter<"OhlcvCandle"> | bigint | number
    open?: DecimalWithAggregatesFilter<"OhlcvCandle"> | Decimal | DecimalJsLike | number | string
    high?: DecimalWithAggregatesFilter<"OhlcvCandle"> | Decimal | DecimalJsLike | number | string
    low?: DecimalWithAggregatesFilter<"OhlcvCandle"> | Decimal | DecimalJsLike | number | string
    close?: DecimalWithAggregatesFilter<"OhlcvCandle"> | Decimal | DecimalJsLike | number | string
    volume?: DecimalWithAggregatesFilter<"OhlcvCandle"> | Decimal | DecimalJsLike | number | string
    trades?: IntWithAggregatesFilter<"OhlcvCandle"> | number
    createdAt?: DateTimeWithAggregatesFilter<"OhlcvCandle"> | Date | string
  }

  export type OhlcvCandleCreateInput = {
    id?: bigint | number
    symbol: string
    interval: string
    openTime: bigint | number
    closeTime: bigint | number
    open: Decimal | DecimalJsLike | number | string
    high: Decimal | DecimalJsLike | number | string
    low: Decimal | DecimalJsLike | number | string
    close: Decimal | DecimalJsLike | number | string
    volume: Decimal | DecimalJsLike | number | string
    trades: number
    createdAt?: Date | string
  }

  export type OhlcvCandleUncheckedCreateInput = {
    id?: bigint | number
    symbol: string
    interval: string
    openTime: bigint | number
    closeTime: bigint | number
    open: Decimal | DecimalJsLike | number | string
    high: Decimal | DecimalJsLike | number | string
    low: Decimal | DecimalJsLike | number | string
    close: Decimal | DecimalJsLike | number | string
    volume: Decimal | DecimalJsLike | number | string
    trades: number
    createdAt?: Date | string
  }

  export type OhlcvCandleUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    symbol?: StringFieldUpdateOperationsInput | string
    interval?: StringFieldUpdateOperationsInput | string
    openTime?: BigIntFieldUpdateOperationsInput | bigint | number
    closeTime?: BigIntFieldUpdateOperationsInput | bigint | number
    open?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    high?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    low?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    close?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volume?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    trades?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OhlcvCandleUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    symbol?: StringFieldUpdateOperationsInput | string
    interval?: StringFieldUpdateOperationsInput | string
    openTime?: BigIntFieldUpdateOperationsInput | bigint | number
    closeTime?: BigIntFieldUpdateOperationsInput | bigint | number
    open?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    high?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    low?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    close?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volume?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    trades?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OhlcvCandleCreateManyInput = {
    id?: bigint | number
    symbol: string
    interval: string
    openTime: bigint | number
    closeTime: bigint | number
    open: Decimal | DecimalJsLike | number | string
    high: Decimal | DecimalJsLike | number | string
    low: Decimal | DecimalJsLike | number | string
    close: Decimal | DecimalJsLike | number | string
    volume: Decimal | DecimalJsLike | number | string
    trades: number
    createdAt?: Date | string
  }

  export type OhlcvCandleUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    symbol?: StringFieldUpdateOperationsInput | string
    interval?: StringFieldUpdateOperationsInput | string
    openTime?: BigIntFieldUpdateOperationsInput | bigint | number
    closeTime?: BigIntFieldUpdateOperationsInput | bigint | number
    open?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    high?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    low?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    close?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volume?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    trades?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OhlcvCandleUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    symbol?: StringFieldUpdateOperationsInput | string
    interval?: StringFieldUpdateOperationsInput | string
    openTime?: BigIntFieldUpdateOperationsInput | bigint | number
    closeTime?: BigIntFieldUpdateOperationsInput | bigint | number
    open?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    high?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    low?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    close?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volume?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    trades?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type OhlcvCandleSymbolIntervalOpenTimeCompoundUniqueInput = {
    symbol: string
    interval: string
    openTime: bigint | number
  }

  export type OhlcvCandleCountOrderByAggregateInput = {
    id?: SortOrder
    symbol?: SortOrder
    interval?: SortOrder
    openTime?: SortOrder
    closeTime?: SortOrder
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
    trades?: SortOrder
    createdAt?: SortOrder
  }

  export type OhlcvCandleAvgOrderByAggregateInput = {
    id?: SortOrder
    openTime?: SortOrder
    closeTime?: SortOrder
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
    trades?: SortOrder
  }

  export type OhlcvCandleMaxOrderByAggregateInput = {
    id?: SortOrder
    symbol?: SortOrder
    interval?: SortOrder
    openTime?: SortOrder
    closeTime?: SortOrder
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
    trades?: SortOrder
    createdAt?: SortOrder
  }

  export type OhlcvCandleMinOrderByAggregateInput = {
    id?: SortOrder
    symbol?: SortOrder
    interval?: SortOrder
    openTime?: SortOrder
    closeTime?: SortOrder
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
    trades?: SortOrder
    createdAt?: SortOrder
  }

  export type OhlcvCandleSumOrderByAggregateInput = {
    id?: SortOrder
    openTime?: SortOrder
    closeTime?: SortOrder
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
    trades?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}