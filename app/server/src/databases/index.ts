/**
 * Copyright © 2021 Province of British Columbia
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Database connection config
 * @author [SungHwan Park](shwpark612@gmail.com)
 * @module
 */

import config from 'config';
import { DBConfig } from '@interfaces/db.interface';

const { host, port, database }: DBConfig = config.get('db');

const dbName = process.env.MONGODB_DB_MAIN || database;
const uri = process.env.MONGODB_URI || `mongodb://${host}:${port}`;

export default {
  url: `${uri}/${dbName}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
};
