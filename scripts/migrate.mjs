import {getMigrations} from 'better-auth/db/migration';
import {getAuth,getPool} from '../lib/auth.mjs';
const auth=getAuth();const migration=await getMigrations(auth.options);await migration.runMigrations();
await getPool().query(`CREATE TABLE IF NOT EXISTS progress(user_id text PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,state jsonb NOT NULL,updated_at timestamptz NOT NULL DEFAULT now(),hint_at timestamptz);
CREATE TABLE IF NOT EXISTS diplomas(user_id text PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,name text NOT NULL,points integer NOT NULL,awarded_at timestamptz NOT NULL DEFAULT now());`);
await getPool().query(`
CREATE TABLE IF NOT EXISTS developers(user_id text PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS bans(id bigserial PRIMARY KEY,user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,developer_id text NOT NULL REFERENCES "user"(id),reason text NOT NULL,created_at timestamptz NOT NULL DEFAULT now(),expires_at timestamptz,revoked_at timestamptz,revoked_by text REFERENCES "user"(id));
CREATE INDEX IF NOT EXISTS bans_user ON bans(user_id);
CREATE TABLE IF NOT EXISTS absences(id bigserial PRIMARY KEY,user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,started_at timestamptz NOT NULL DEFAULT now(),ended_at timestamptz);
CREATE UNIQUE INDEX IF NOT EXISTS absences_open ON absences(user_id) WHERE ended_at IS NULL;
CREATE INDEX IF NOT EXISTS absences_time ON absences(started_at DESC);
`);
await getPool().end();console.log('Auth, game and moderation migrations complete');
