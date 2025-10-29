pg_dump: warning: there are circular foreign-key constraints on this table:
pg_dump: detail: key
pg_dump: hint: You might not be able to restore the dump without using --disable-triggers or temporarily dropping the constraints.
pg_dump: hint: Consider using a full dump instead of a --data-only dump to avoid this problem.
--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: _realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA _realtime;


ALTER SCHEMA _realtime OWNER TO supabase_admin;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pg_net; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_net; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_net IS 'Async HTTP';


--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: pgsodium; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA pgsodium;


ALTER SCHEMA pgsodium OWNER TO supabase_admin;

--
-- Name: pgsodium; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgsodium WITH SCHEMA pgsodium;


--
-- Name: EXTENSION pgsodium; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgsodium IS 'Pgsodium is a modern cryptography library for Postgres.';


--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: supabase_functions; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA supabase_functions;


ALTER SCHEMA supabase_functions OWNER TO supabase_admin;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: pgjwt; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgjwt WITH SCHEMA extensions;


--
-- Name: EXTENSION pgjwt; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgjwt IS 'JSON Web Token API for Postgresql';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: comparisions; Type: TYPE; Schema: public; Owner: supabase_admin
--

CREATE TYPE public.comparisions AS ENUM (
    '>',
    '>=',
    '=',
    '<=',
    '<'
);


ALTER TYPE public.comparisions OWNER TO supabase_admin;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: postgres
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO postgres;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: postgres
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: postgres
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO postgres;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: postgres
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: postgres
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RAISE WARNING 'PgBouncer auth request: %', p_usename;

    RETURN QUERY
    SELECT usename::TEXT, passwd::TEXT FROM pg_catalog.pg_shadow
    WHERE usename = p_usename;
END;
$$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO postgres;

--
-- Name: is_admin(); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION public.is_admin() RETURNS boolean
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
begin
  return exists (
    select 1 from public.users
    where id = auth.uid()
    and role = 'admin'
  );
end;
$$;


ALTER FUNCTION public.is_admin() OWNER TO supabase_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO supabase_admin;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      PERFORM pg_notify(
          'realtime:system',
          jsonb_build_object(
              'error', SQLERRM,
              'function', 'realtime.send',
              'event', event,
              'topic', topic,
              'private', private
          )::text
      );
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
  v_order_by text;
  v_sort_order text;
begin
  case
    when sortcolumn = 'name' then
      v_order_by = 'name';
    when sortcolumn = 'updated_at' then
      v_order_by = 'updated_at';
    when sortcolumn = 'created_at' then
      v_order_by = 'created_at';
    when sortcolumn = 'last_accessed_at' then
      v_order_by = 'last_accessed_at';
    else
      v_order_by = 'name';
  end case;

  case
    when sortorder = 'asc' then
      v_sort_order = 'asc';
    when sortorder = 'desc' then
      v_sort_order = 'desc';
    else
      v_sort_order = 'asc';
  end case;

  v_order_by = v_order_by || ' ' || v_sort_order;

  return query execute
    'with folders as (
       select path_tokens[$1] as folder
       from storage.objects
         where objects.name ilike $2 || $3 || ''%''
           and bucket_id = $4
           and array_length(objects.path_tokens, 1) <> $1
       group by folder
       order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

--
-- Name: http_request(); Type: FUNCTION; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE FUNCTION supabase_functions.http_request() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'supabase_functions'
    AS $$
  DECLARE
    request_id bigint;
    payload jsonb;
    url text := TG_ARGV[0]::text;
    method text := TG_ARGV[1]::text;
    headers jsonb DEFAULT '{}'::jsonb;
    params jsonb DEFAULT '{}'::jsonb;
    timeout_ms integer DEFAULT 1000;
  BEGIN
    IF url IS NULL OR url = 'null' THEN
      RAISE EXCEPTION 'url argument is missing';
    END IF;

    IF method IS NULL OR method = 'null' THEN
      RAISE EXCEPTION 'method argument is missing';
    END IF;

    IF TG_ARGV[2] IS NULL OR TG_ARGV[2] = 'null' THEN
      headers = '{"Content-Type": "application/json"}'::jsonb;
    ELSE
      headers = TG_ARGV[2]::jsonb;
    END IF;

    IF TG_ARGV[3] IS NULL OR TG_ARGV[3] = 'null' THEN
      params = '{}'::jsonb;
    ELSE
      params = TG_ARGV[3]::jsonb;
    END IF;

    IF TG_ARGV[4] IS NULL OR TG_ARGV[4] = 'null' THEN
      timeout_ms = 1000;
    ELSE
      timeout_ms = TG_ARGV[4]::integer;
    END IF;

    CASE
      WHEN method = 'GET' THEN
        SELECT http_get INTO request_id FROM net.http_get(
          url,
          params,
          headers,
          timeout_ms
        );
      WHEN method = 'POST' THEN
        payload = jsonb_build_object(
          'old_record', OLD,
          'record', NEW,
          'type', TG_OP,
          'table', TG_TABLE_NAME,
          'schema', TG_TABLE_SCHEMA
        );

        SELECT http_post INTO request_id FROM net.http_post(
          url,
          payload,
          params,
          headers,
          timeout_ms
        );
      ELSE
        RAISE EXCEPTION 'method argument % is invalid', method;
    END CASE;

    INSERT INTO supabase_functions.hooks
      (hook_table_id, hook_name, request_id)
    VALUES
      (TG_RELID, TG_NAME, request_id);

    RETURN NEW;
  END
$$;


ALTER FUNCTION supabase_functions.http_request() OWNER TO supabase_functions_admin;

--
-- Name: secrets_encrypt_secret_secret(); Type: FUNCTION; Schema: vault; Owner: supabase_admin
--

CREATE FUNCTION vault.secrets_encrypt_secret_secret() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
		BEGIN
		        new.secret = CASE WHEN new.secret IS NULL THEN NULL ELSE
			CASE WHEN new.key_id IS NULL THEN NULL ELSE pg_catalog.encode(
			  pgsodium.crypto_aead_det_encrypt(
				pg_catalog.convert_to(new.secret, 'utf8'),
				pg_catalog.convert_to((new.id::text || new.description::text || new.created_at::text || new.updated_at::text)::text, 'utf8'),
				new.key_id::uuid,
				new.nonce
			  ),
				'base64') END END;
		RETURN new;
		END;
		$$;


ALTER FUNCTION vault.secrets_encrypt_secret_secret() OWNER TO supabase_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: extensions; Type: TABLE; Schema: _realtime; Owner: supabase_admin
--

CREATE TABLE _realtime.extensions (
    id uuid NOT NULL,
    type text,
    settings jsonb,
    tenant_external_id text,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);


ALTER TABLE _realtime.extensions OWNER TO supabase_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: _realtime; Owner: supabase_admin
--

CREATE TABLE _realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE _realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: tenants; Type: TABLE; Schema: _realtime; Owner: supabase_admin
--

CREATE TABLE _realtime.tenants (
    id uuid NOT NULL,
    name text,
    external_id text,
    jwt_secret text,
    max_concurrent_users integer DEFAULT 200 NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    max_events_per_second integer DEFAULT 100 NOT NULL,
    postgres_cdc_default text DEFAULT 'postgres_cdc_rls'::text,
    max_bytes_per_second integer DEFAULT 100000 NOT NULL,
    max_channels_per_client integer DEFAULT 100 NOT NULL,
    max_joins_per_second integer DEFAULT 500 NOT NULL,
    suspend boolean DEFAULT false,
    jwt_jwks jsonb,
    notify_private_alpha boolean DEFAULT false,
    private_only boolean DEFAULT false NOT NULL
);


ALTER TABLE _realtime.tenants OWNER TO supabase_admin;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: academic_entries; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.academic_entries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    enquiry_id uuid NOT NULL,
    study_level uuid,
    stream uuid,
    pursue character varying(255),
    score numeric(5,2),
    completion_year integer,
    duration_years integer,
    completion_date text,
    course uuid
);


ALTER TABLE public.academic_entries OWNER TO supabase_admin;

--
-- Name: courses; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.courses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    level_id uuid NOT NULL,
    course_name character varying(255) NOT NULL,
    study_area character varying(255),
    course_duration integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    description text
);


ALTER TABLE public.courses OWNER TO supabase_admin;

--
-- Name: custom_fields; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.custom_fields (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    field_name text
);


ALTER TABLE public.custom_fields OWNER TO supabase_admin;

--
-- Name: custom_programs_fields; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.custom_programs_fields (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    program_id uuid,
    custom_field uuid,
    field_value text,
    comparision public.comparisions DEFAULT '>'::public.comparisions,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.custom_programs_fields OWNER TO supabase_admin;

--
-- Name: education_levels; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.education_levels (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    level_name character varying(100) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.education_levels OWNER TO supabase_admin;

--
-- Name: enquiries; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.enquiries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(50),
    overall_percentage numeric(5,2),
    is_gap boolean,
    gap_years integer,
    custom_fields jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    createdby uuid
);


ALTER TABLE public.enquiries OWNER TO supabase_admin;

--
-- Name: enquiries_backup; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.enquiries_backup (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_name text,
    email text,
    phone text,
    study_level text,
    study_area text,
    preferred_university text,
    preferred_country text,
    budget_range text,
    ielts_score numeric(3,1),
    toefl_score integer,
    pte_score integer,
    det_score integer,
    percentage numeric(5,2),
    gre_score integer,
    gmat_score integer,
    sat_score integer,
    preferred_intake text,
    additional_requirements text,
    message text,
    status text DEFAULT 'pending'::text,
    quried_by_user uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.enquiries_backup OWNER TO supabase_admin;

--
-- Name: interest_information; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.interest_information (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    enquiry_id uuid NOT NULL,
    study_level uuid,
    stream uuid,
    pursue text,
    course uuid
);


ALTER TABLE public.interest_information OWNER TO supabase_admin;

--
-- Name: programs; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.programs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    sr_no integer,
    university text NOT NULL,
    university_ranking integer,
    study_level text,
    study_area text,
    programme_name text NOT NULL,
    campus text,
    duration text,
    open_intake text,
    open_call text,
    application_deadline text,
    entry_requirements text,
    percentage_required numeric(5,2),
    moi text,
    ielts_score numeric(3,1),
    ielts_no_band_less_than numeric(3,1),
    toefl_score integer,
    toefl_no_band_less_than integer,
    pte_score integer,
    pte_no_band_less_than integer,
    det_score integer,
    det_no_band_less_than integer,
    tolc_score integer,
    sat_score integer,
    gre_score integer,
    gmat_score integer,
    cents_score integer,
    til_score integer,
    arched_test text,
    application_fees numeric(10,2),
    additional_requirements text,
    remarks text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.programs OWNER TO supabase_admin;

--
-- Name: streams; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.streams (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    course uuid,
    name text,
    description text
);


ALTER TABLE public.streams OWNER TO supabase_admin;

--
-- Name: users; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    role text DEFAULT 'user'::text,
    phone_number text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    password text,
    full_name text,
    profile_picture_url text,
    status text DEFAULT 'active'::text,
    email_verified boolean DEFAULT false,
    oauth_provider text,
    oauth_id text,
    bio text,
    timezone text,
    last_login_ip text,
    last_login_at timestamp with time zone,
    password_iv text,
    password_tag text,
    password_algo text DEFAULT 'aes-256-gcm'::text,
    CONSTRAINT users_role_check CHECK ((role = ANY (ARRAY['admin'::text, 'user'::text])))
);


ALTER TABLE public.users OWNER TO supabase_admin;

--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: hooks; Type: TABLE; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE TABLE supabase_functions.hooks (
    id bigint NOT NULL,
    hook_table_id integer NOT NULL,
    hook_name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    request_id bigint
);


ALTER TABLE supabase_functions.hooks OWNER TO supabase_functions_admin;

--
-- Name: TABLE hooks; Type: COMMENT; Schema: supabase_functions; Owner: supabase_functions_admin
--

COMMENT ON TABLE supabase_functions.hooks IS 'Supabase Functions Hooks: Audit trail for triggered hooks.';


--
-- Name: hooks_id_seq; Type: SEQUENCE; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE SEQUENCE supabase_functions.hooks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE supabase_functions.hooks_id_seq OWNER TO supabase_functions_admin;

--
-- Name: hooks_id_seq; Type: SEQUENCE OWNED BY; Schema: supabase_functions; Owner: supabase_functions_admin
--

ALTER SEQUENCE supabase_functions.hooks_id_seq OWNED BY supabase_functions.hooks.id;


--
-- Name: migrations; Type: TABLE; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE TABLE supabase_functions.migrations (
    version text NOT NULL,
    inserted_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE supabase_functions.migrations OWNER TO supabase_functions_admin;

--
-- Name: decrypted_secrets; Type: VIEW; Schema: vault; Owner: supabase_admin
--

CREATE VIEW vault.decrypted_secrets AS
 SELECT secrets.id,
    secrets.name,
    secrets.description,
    secrets.secret,
        CASE
            WHEN (secrets.secret IS NULL) THEN NULL::text
            ELSE
            CASE
                WHEN (secrets.key_id IS NULL) THEN NULL::text
                ELSE convert_from(pgsodium.crypto_aead_det_decrypt(decode(secrets.secret, 'base64'::text), convert_to(((((secrets.id)::text || secrets.description) || (secrets.created_at)::text) || (secrets.updated_at)::text), 'utf8'::name), secrets.key_id, secrets.nonce), 'utf8'::name)
            END
        END AS decrypted_secret,
    secrets.key_id,
    secrets.nonce,
    secrets.created_at,
    secrets.updated_at
   FROM vault.secrets;


ALTER TABLE vault.decrypted_secrets OWNER TO supabase_admin;

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: hooks id; Type: DEFAULT; Schema: supabase_functions; Owner: supabase_functions_admin
--

ALTER TABLE ONLY supabase_functions.hooks ALTER COLUMN id SET DEFAULT nextval('supabase_functions.hooks_id_seq'::regclass);


--
-- Data for Name: extensions; Type: TABLE DATA; Schema: _realtime; Owner: supabase_admin
--

COPY _realtime.extensions (id, type, settings, tenant_external_id, inserted_at, updated_at) FROM stdin;
08c987b7-2f3a-49ca-a9fb-a8b29fc36c70	postgres_cdc_rls	{"region": "us-east-1", "db_host": "UQODY0+dwiSQvuHHKwAFHg==", "db_name": "sWBpZNdjggEPTQVlI52Zfw==", "db_port": "+enMDFi1J/3IrrquHHwUmA==", "db_user": "uxbEq/zz8DXVD53TOI1zmw==", "slot_name": "supabase_realtime_replication_slot", "db_password": "NDuNhRGk7GmmGLyxQRt3uguJShPYqKHx5g7pWzkCjE1PNrrhma6I8nd28t/mto4/", "publication": "supabase_realtime", "ssl_enforced": false, "poll_interval_ms": 100, "poll_max_changes": 100, "poll_max_record_bytes": 1048576}	realtime-dev	2025-10-19 21:41:47	2025-10-19 21:41:47
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: _realtime; Owner: supabase_admin
--

COPY _realtime.schema_migrations (version, inserted_at) FROM stdin;
20210706140551	2025-10-17 06:40:30
20220329161857	2025-10-17 06:40:30
20220410212326	2025-10-17 06:40:30
20220506102948	2025-10-17 06:40:30
20220527210857	2025-10-17 06:40:30
20220815211129	2025-10-17 06:40:30
20220815215024	2025-10-17 06:40:30
20220818141501	2025-10-17 06:40:30
20221018173709	2025-10-17 06:40:30
20221102172703	2025-10-17 06:40:30
20221223010058	2025-10-17 06:40:30
20230110180046	2025-10-17 06:40:30
20230810220907	2025-10-17 06:40:30
20230810220924	2025-10-17 06:40:30
20231024094642	2025-10-17 06:40:30
20240306114423	2025-10-17 06:40:30
20240418082835	2025-10-17 06:40:30
20240625211759	2025-10-17 06:40:30
20240704172020	2025-10-17 06:40:30
20240902173232	2025-10-17 06:40:30
20241106103258	2025-10-17 06:40:30
\.


--
-- Data for Name: tenants; Type: TABLE DATA; Schema: _realtime; Owner: supabase_admin
--

COPY _realtime.tenants (id, name, external_id, jwt_secret, max_concurrent_users, inserted_at, updated_at, max_events_per_second, postgres_cdc_default, max_bytes_per_second, max_channels_per_client, max_joins_per_second, suspend, jwt_jwks, notify_private_alpha, private_only) FROM stdin;
a6946090-6164-4464-b7fa-486a09e4ce73	realtime-dev	realtime-dev	9r3kwpoUmE/JtzFBUUb3ryq3OhJmNiwI1kTDMaUfRu1PNrrhma6I8nd28t/mto4/	200	2025-10-19 21:41:47	2025-10-19 21:41:47	100	postgres_cdc_rls	100000	100	100	f	\N	f	f
\.


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
00000000-0000-0000-0000-000000000000	1501768c-78f8-46e2-93c3-4cb2523ebc1b	{"action":"user_confirmation_requested","actor_id":"7bafe679-b26b-4191-83b3-e46febde102e","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-17 07:55:33.78668+00	
00000000-0000-0000-0000-000000000000	9c434f14-9a9f-431e-bcc1-b8efe45292c3	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"admin@example.com","user_id":"7bafe679-b26b-4191-83b3-e46febde102e","user_phone":""}}	2025-10-17 07:58:12.339752+00	
00000000-0000-0000-0000-000000000000	7161bf97-e673-4bc3-a906-7c107368d4de	{"action":"user_confirmation_requested","actor_id":"38db20e5-47d3-4f28-9733-8f10623d8866","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-17 07:59:27.316727+00	
00000000-0000-0000-0000-000000000000	6acb4126-a3b6-4588-b94f-82591025a2d8	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"admin@example.com","user_id":"38db20e5-47d3-4f28-9733-8f10623d8866","user_phone":""}}	2025-10-17 09:14:08.753937+00	
00000000-0000-0000-0000-000000000000	65176a8d-01e0-4645-97ce-a58138b37d9c	{"action":"user_confirmation_requested","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-17 09:15:00.898865+00	
00000000-0000-0000-0000-000000000000	c27fe7bf-4df7-4df9-a8aa-2c00997f9dc0	{"action":"user_confirmation_requested","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-17 09:18:22.667769+00	
00000000-0000-0000-0000-000000000000	80a40f85-f2e8-41ff-b761-c94796bfce17	{"action":"user_confirmation_requested","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-17 09:20:54.061742+00	
00000000-0000-0000-0000-000000000000	ff30ca25-5349-4061-9a61-1659b0fad223	{"action":"user_confirmation_requested","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-17 09:22:35.577288+00	
00000000-0000-0000-0000-000000000000	6d104987-39fe-4b3b-b0bf-0dd1fc33dd31	{"action":"user_confirmation_requested","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-17 09:23:57.569153+00	
00000000-0000-0000-0000-000000000000	cee4409e-6dae-4a71-84cb-fa8f933716a8	{"action":"user_confirmation_requested","actor_id":"2f393221-61ad-47e8-aee4-3ecdff2d6247","actor_username":"parivesh@ibrinfotech.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-17 09:26:11.40136+00	
00000000-0000-0000-0000-000000000000	3b153e56-9640-48e7-a7a9-ad4b42ea6bb4	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-17 09:31:56.40031+00	
00000000-0000-0000-0000-000000000000	ffc92610-5802-4516-8cc6-2cd8f3265b61	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-17 09:37:28.153068+00	
00000000-0000-0000-0000-000000000000	b7efc12b-4e25-4b14-b7e2-436ee292a7ee	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-17 10:38:18.661967+00	
00000000-0000-0000-0000-000000000000	2c3594cb-037d-4555-87c7-60027860e0c3	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-17 10:38:18.664143+00	
00000000-0000-0000-0000-000000000000	dd843b3b-59b2-45e9-88be-eda40bdd7750	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-22 05:04:55.737231+00	
00000000-0000-0000-0000-000000000000	2662c95e-7020-4eaa-b576-45e5f8e5ce01	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-22 05:05:07.507885+00	
00000000-0000-0000-0000-000000000000	9d1999a8-2093-4547-a845-bcb72dedbfd3	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-22 05:05:07.508868+00	
00000000-0000-0000-0000-000000000000	0fe0df83-b308-49a8-bce7-cf15a030766f	{"action":"logout","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account"}	2025-10-22 05:24:41.718196+00	
00000000-0000-0000-0000-000000000000	c20a42ed-fedf-4226-ac40-7176c3b9b2c6	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-22 05:25:09.979247+00	
00000000-0000-0000-0000-000000000000	63ae30f6-744e-4c70-937e-cf24f03cca21	{"action":"logout","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account"}	2025-10-22 05:25:39.911485+00	
00000000-0000-0000-0000-000000000000	436d1593-bbe3-404c-bbec-2ae5c9da94d3	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-22 05:26:30.239417+00	
00000000-0000-0000-0000-000000000000	8256eee0-e56f-4ada-bc48-52ef2ce48909	{"action":"logout","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account"}	2025-10-22 05:28:07.191767+00	
00000000-0000-0000-0000-000000000000	fb5c3a2d-48d8-4dba-b0c8-00a81461b077	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-22 05:28:17.497654+00	
00000000-0000-0000-0000-000000000000	e88a46fd-9ac3-474a-b0b3-58df4986b830	{"action":"logout","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account"}	2025-10-22 05:31:56.452753+00	
00000000-0000-0000-0000-000000000000	9c72cc96-35d5-4bb9-be45-665b4d1033a6	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-22 05:32:12.385965+00	
00000000-0000-0000-0000-000000000000	4c00111c-e2ff-4bfa-b0b2-7dca4bd04e9c	{"action":"logout","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account"}	2025-10-22 05:34:53.426466+00	
00000000-0000-0000-0000-000000000000	0bfb9ecc-fb41-4d29-a465-e767b8cdcc8e	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-22 05:34:59.696838+00	
00000000-0000-0000-0000-000000000000	1e55424c-7e2a-4baa-b702-d83bb598a2fc	{"action":"logout","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account"}	2025-10-22 05:35:28.708198+00	
00000000-0000-0000-0000-000000000000	fcaed824-b34b-4256-88d6-ef2e80fd9762	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-22 05:35:36.842941+00	
00000000-0000-0000-0000-000000000000	25fdfb24-ce92-407a-b8cf-2211949cec2c	{"action":"logout","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account"}	2025-10-22 05:38:55.211174+00	
00000000-0000-0000-0000-000000000000	ca53af5f-1d21-43d8-b1bc-1b745ff90144	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-22 05:39:06.670507+00	
00000000-0000-0000-0000-000000000000	0a600cae-6dbe-4300-80f6-e7ca27c8eaa8	{"action":"logout","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account"}	2025-10-22 05:39:26.998749+00	
00000000-0000-0000-0000-000000000000	e8a43f41-dc4c-49e8-9651-0d0b609279a0	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-22 05:39:35.128954+00	
00000000-0000-0000-0000-000000000000	443c6e1d-8043-4a52-a88d-0e24989c540c	{"action":"logout","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account"}	2025-10-22 05:43:11.033282+00	
00000000-0000-0000-0000-000000000000	b0976a9d-400d-4194-97af-d46e674ecad8	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-22 05:43:18.753665+00	
00000000-0000-0000-0000-000000000000	27f66a30-9dff-4fed-9646-ea24fecde310	{"action":"logout","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account"}	2025-10-22 05:47:47.711147+00	
00000000-0000-0000-0000-000000000000	3d4929a3-2c1f-43b9-979d-b490ab15a55b	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-22 05:47:56.905644+00	
00000000-0000-0000-0000-000000000000	7216ef8c-b0cf-419d-8590-fd755ea2be99	{"action":"logout","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account"}	2025-10-22 05:58:43.807037+00	
00000000-0000-0000-0000-000000000000	164bea3a-8291-4d2e-a907-7fa2ca961a7b	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-22 05:58:52.433065+00	
00000000-0000-0000-0000-000000000000	e71b4dc4-7628-4f39-8b1a-d549055b4b82	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-22 06:57:34.532299+00	
00000000-0000-0000-0000-000000000000	0d501d7e-7395-4814-8912-47a1f7643622	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-22 06:57:34.534341+00	
00000000-0000-0000-0000-000000000000	1c131b95-cc82-4685-9ca7-0a3b04edac1d	{"action":"logout","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account"}	2025-10-22 07:09:56.701929+00	
00000000-0000-0000-0000-000000000000	9b26c8c3-44c5-4adc-bea5-2a816ecb2f1b	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-22 07:10:14.388411+00	
00000000-0000-0000-0000-000000000000	c269b108-81c1-4356-853c-46ae5a975567	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-22 08:09:33.736213+00	
00000000-0000-0000-0000-000000000000	ddfb67b3-dc12-40dd-bafc-6daabbca8b1e	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-22 08:09:33.739313+00	
00000000-0000-0000-0000-000000000000	6e800f4d-10ad-417f-b2b6-3d37ac96df12	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-22 09:12:23.933862+00	
00000000-0000-0000-0000-000000000000	4de5a420-4694-4b0b-b163-ca7e1b275420	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-22 09:12:23.936295+00	
00000000-0000-0000-0000-000000000000	3fe435dd-6b90-4767-ab4d-c75d1ec82298	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-22 10:10:52.794236+00	
00000000-0000-0000-0000-000000000000	8b26c780-8c7f-4545-aa47-1e475d61dd02	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-22 10:10:52.796737+00	
00000000-0000-0000-0000-000000000000	33031573-021d-4f65-ae8f-570c235be3a3	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-22 11:09:29.483005+00	
00000000-0000-0000-0000-000000000000	f62d6f51-1aba-462a-b3fa-2b9506056383	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-22 11:09:29.484887+00	
00000000-0000-0000-0000-000000000000	cbd782f2-98be-4e62-a967-03fffb48f893	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-22 12:10:39.774607+00	
00000000-0000-0000-0000-000000000000	393db4a6-7a68-4bc5-aab7-617c6b4ffc39	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-22 12:10:39.776893+00	
00000000-0000-0000-0000-000000000000	df8eb72c-2f65-4851-b1b3-590f177f668b	{"action":"logout","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account"}	2025-10-22 12:19:27.098885+00	
00000000-0000-0000-0000-000000000000	6744b07a-7df0-4d86-b66e-d4f98e9e1eb4	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-22 12:20:01.338411+00	
00000000-0000-0000-0000-000000000000	55d0644f-4a41-45e4-b0d5-a940b08e644d	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-22 13:18:53.794156+00	
00000000-0000-0000-0000-000000000000	d2b3dd6e-4020-406f-b2fe-0dc882bd7c01	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-22 13:18:53.795944+00	
00000000-0000-0000-0000-000000000000	2a57cf2d-e89d-46a8-a6c4-cd648e17356c	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-23 05:03:45.781056+00	
00000000-0000-0000-0000-000000000000	8babcbda-f460-432f-9c81-786ce09f4657	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-23 05:03:45.785383+00	
00000000-0000-0000-0000-000000000000	da7da4fe-6c1d-4885-bb53-f29d31f9c830	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-23 06:02:09.517987+00	
00000000-0000-0000-0000-000000000000	bb59674e-f6ca-4adc-a7f6-15da237784df	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-23 06:02:09.520043+00	
00000000-0000-0000-0000-000000000000	aedc7900-0d69-419e-b346-a76111ad72eb	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-23 07:02:33.710164+00	
00000000-0000-0000-0000-000000000000	875db95d-2cd9-42ef-a17e-72e7993c9407	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-23 07:02:33.712315+00	
00000000-0000-0000-0000-000000000000	41a3d357-222c-464f-a474-6f2056d35293	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-23 08:01:45.155135+00	
00000000-0000-0000-0000-000000000000	474594c8-359f-48c4-aba0-54ad4c030d9b	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-23 08:01:45.157982+00	
00000000-0000-0000-0000-000000000000	e794444f-d7bc-496c-a726-200141889e00	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-23 09:04:44.778221+00	
00000000-0000-0000-0000-000000000000	a88000c6-2c94-49be-bc0d-2ec4af846dbf	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-23 09:04:44.782286+00	
00000000-0000-0000-0000-000000000000	3f34a624-b0a0-442b-a1e7-35a116bccfbd	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-23 10:03:45.986123+00	
00000000-0000-0000-0000-000000000000	84441b0b-6d7b-4d6a-9b6e-ef4cd89c9025	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-23 10:03:45.988541+00	
00000000-0000-0000-0000-000000000000	784de192-dc7b-459b-9785-9fd5c6cd13db	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-23 11:04:01.168433+00	
00000000-0000-0000-0000-000000000000	5f2e4dc2-5dc3-4761-bf40-6754ceadbfaf	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-23 11:04:01.171211+00	
00000000-0000-0000-0000-000000000000	6d23f8b2-e326-4853-bc39-7f86e845fdbb	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-23 12:02:48.139876+00	
00000000-0000-0000-0000-000000000000	20c7270b-8eda-4dcc-9592-268a066a7775	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-23 12:02:48.141825+00	
00000000-0000-0000-0000-000000000000	40c1bd9a-504b-4a8d-9cce-845ae95d25af	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"user@example.com","user_id":"67781f8f-2749-4deb-915a-bf160bf0f16e","user_phone":""}}	2025-10-23 12:15:14.521061+00	
00000000-0000-0000-0000-000000000000	bea0d3bb-d3b5-4710-8cb8-51f170af8525	{"action":"logout","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account"}	2025-10-23 12:38:44.55527+00	
00000000-0000-0000-0000-000000000000	7cd3c123-d75a-4170-8219-a1ae78ee8ab9	{"action":"login","actor_id":"67781f8f-2749-4deb-915a-bf160bf0f16e","actor_username":"user@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-23 12:38:51.626971+00	
00000000-0000-0000-0000-000000000000	a8809557-1dd2-47b9-9549-5f5893793991	{"action":"logout","actor_id":"67781f8f-2749-4deb-915a-bf160bf0f16e","actor_username":"user@example.com","actor_via_sso":false,"log_type":"account"}	2025-10-23 12:41:54.175135+00	
00000000-0000-0000-0000-000000000000	09035b33-1c8f-45df-b152-f1ca6b58eaea	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-23 12:42:02.460405+00	
00000000-0000-0000-0000-000000000000	74ed0666-eaab-4e4f-8555-aa2506e8c5f2	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"user2@example.com","user_id":"a6a6777e-4916-4fa7-87e7-0e4056464c8d","user_phone":""}}	2025-10-23 12:44:28.273687+00	
00000000-0000-0000-0000-000000000000	58c26f33-4bdb-41df-999e-a699ea40c6b8	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"user2@example.com","user_id":"a6a6777e-4916-4fa7-87e7-0e4056464c8d","user_phone":""}}	2025-10-23 12:47:43.652255+00	
00000000-0000-0000-0000-000000000000	823d1d21-1fc4-484a-84ba-d6cfbd852473	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"user@example.com","user_id":"67781f8f-2749-4deb-915a-bf160bf0f16e","user_phone":""}}	2025-10-23 12:47:43.659545+00	
00000000-0000-0000-0000-000000000000	78332806-d3b9-4fd4-bc09-86f04bf35672	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"user@example.com","user_id":"2f92b15d-8064-45f2-b0ca-559eb55f32b0","user_phone":""}}	2025-10-23 12:47:48.547113+00	
00000000-0000-0000-0000-000000000000	8fb3bb98-c30d-4647-868d-e1afb96b3839	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"alice.smith@example.com","user_id":"654f35de-4bd1-43d4-92ec-922fa381f015","user_phone":""}}	2025-10-23 13:09:27.108041+00	
00000000-0000-0000-0000-000000000000	635a07d7-264f-49f8-bd8e-b72d8349ca35	{"action":"logout","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account"}	2025-10-23 13:09:44.295972+00	
00000000-0000-0000-0000-000000000000	4c28d9e4-24f9-498c-95a3-943e81a9b34f	{"action":"login","actor_id":"654f35de-4bd1-43d4-92ec-922fa381f015","actor_username":"alice.smith@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-23 13:09:58.221185+00	
00000000-0000-0000-0000-000000000000	6ccfadfa-80f2-4412-9b6d-ada046dfed11	{"action":"logout","actor_id":"654f35de-4bd1-43d4-92ec-922fa381f015","actor_username":"alice.smith@example.com","actor_via_sso":false,"log_type":"account"}	2025-10-23 13:10:03.568066+00	
00000000-0000-0000-0000-000000000000	e23d11e3-92da-471c-a4a6-d878387eb30e	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-23 13:18:10.393076+00	
00000000-0000-0000-0000-000000000000	99532f59-23ef-4834-9c74-cdbde811ec5c	{"action":"logout","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account"}	2025-10-23 13:35:22.127536+00	
00000000-0000-0000-0000-000000000000	518e72db-ecb9-40e9-87e4-a3933cb4f8b7	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-23 13:36:13.983212+00	
00000000-0000-0000-0000-000000000000	1915ee66-1dcd-4e69-bc6e-47ca1debee7c	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-23 13:41:24.348699+00	
00000000-0000-0000-0000-000000000000	d390a7b7-0484-418e-8d41-7f8391073b6b	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-23 13:45:38.317782+00	
00000000-0000-0000-0000-000000000000	d4bc4a7c-1bba-48b9-9ddb-4a80bdc2955a	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 05:21:46.059351+00	
00000000-0000-0000-0000-000000000000	d5b35da5-30f6-43bc-88cb-18188d0e6325	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 05:21:46.062204+00	
00000000-0000-0000-0000-000000000000	86703fa2-9e07-4b39-81b5-7f9e20fbb254	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 05:21:48.226278+00	
00000000-0000-0000-0000-000000000000	4e7c43ca-a4fa-4e51-8ee5-7e8495269394	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 05:21:48.227735+00	
00000000-0000-0000-0000-000000000000	53909ed2-7bda-49bb-a245-b022e40a0c3a	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 05:21:48.298746+00	
00000000-0000-0000-0000-000000000000	43c9d502-b8e3-4626-90b8-5579e600c76f	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 05:21:48.344126+00	
00000000-0000-0000-0000-000000000000	03b109a3-cfe4-4d9a-b6c7-b1b8c00f1e9e	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 05:21:48.524197+00	
00000000-0000-0000-0000-000000000000	85427bcb-a964-4d41-b1a5-e217cd3ff827	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 05:21:49.422594+00	
00000000-0000-0000-0000-000000000000	9c8bbd08-ff59-4619-af2b-a5477d3d40b4	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 05:28:35.18184+00	
00000000-0000-0000-0000-000000000000	079cba67-a606-4f64-96f8-8471c14c2e87	{"action":"logout","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account"}	2025-10-24 05:28:38.570997+00	
00000000-0000-0000-0000-000000000000	5e3aa5ce-d697-4aa5-ba89-b20bcb0e2489	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-24 05:28:45.308084+00	
00000000-0000-0000-0000-000000000000	8ae808cc-449a-4ed0-be86-b25b38cea9b6	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-24 05:47:44.955778+00	
00000000-0000-0000-0000-000000000000	1421c814-e78d-4fb6-b0f0-29a4746f50b7	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 06:42:17.254461+00	
00000000-0000-0000-0000-000000000000	5b48353f-4d8c-4460-a494-4832765a417d	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 06:42:17.257065+00	
00000000-0000-0000-0000-000000000000	b1cb27a0-3add-425a-90b1-824eb42ab585	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 11:05:20.055125+00	
00000000-0000-0000-0000-000000000000	341aff1a-e766-4ca0-b0c9-a2949ac3ad24	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 11:05:20.057187+00	
00000000-0000-0000-0000-000000000000	ad5c4e6b-ddf0-4000-ab4f-6d480800dced	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 11:29:44.699075+00	
00000000-0000-0000-0000-000000000000	d9c029be-6e86-4081-a270-e9fc1fce847d	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 11:29:44.701232+00	
00000000-0000-0000-0000-000000000000	2eb3d98d-eef7-4332-8d45-5ead947c74c6	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-24 11:32:55.304036+00	
00000000-0000-0000-0000-000000000000	a119d042-8259-4dd4-bd43-7a666075ba77	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"user+1@example.com","user_id":"5fc9797d-2dd8-4d80-ad3b-7911d24dffad","user_phone":""}}	2025-10-24 11:34:52.325942+00	
00000000-0000-0000-0000-000000000000	c73918f8-3d18-4448-9b2f-8ef2b5a9dc87	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 11:36:11.767881+00	
00000000-0000-0000-0000-000000000000	fb711558-9cf8-450c-8489-9ad1951dade6	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 11:36:11.770577+00	
00000000-0000-0000-0000-000000000000	5d96981d-ee63-499a-b593-73a91cc9bba4	{"action":"logout","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account"}	2025-10-24 11:36:16.434791+00	
00000000-0000-0000-0000-000000000000	35bc99ac-9995-43d6-b366-5e86c43fc2ab	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-24 11:36:23.070292+00	
00000000-0000-0000-0000-000000000000	2c59c3d7-21a9-44a2-9a23-69b17657dadb	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 05:21:48.274236+00	
00000000-0000-0000-0000-000000000000	e3be5a89-2f3d-4090-b118-e4e419deb8d2	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 07:45:07.519192+00	
00000000-0000-0000-0000-000000000000	c4243b19-d14b-4400-8080-17c91698ffb3	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 07:45:07.520901+00	
00000000-0000-0000-0000-000000000000	0508f99f-0b57-41f4-8084-e5b43647a9be	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 09:02:49.313313+00	
00000000-0000-0000-0000-000000000000	09bd3f4b-a950-4435-9a39-fad3ec29ddaa	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 09:02:49.316067+00	
00000000-0000-0000-0000-000000000000	200d3afe-25e8-418b-a164-fac8db743fbb	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 10:04:47.803346+00	
00000000-0000-0000-0000-000000000000	7f078630-f0b3-41dc-980b-d3cb09e3fcb4	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 10:04:47.806373+00	
00000000-0000-0000-0000-000000000000	0513becf-73ff-4184-98b8-f338048ba1d6	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-24 10:11:26.487087+00	
00000000-0000-0000-0000-000000000000	e3c77936-fd4c-46f1-8322-bbfd97018aee	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"nikhil.jain@ibrinfotech.com","user_id":"b0cc2354-83a6-417c-ac4c-915914906a20","user_phone":""}}	2025-10-24 10:13:10.805178+00	
00000000-0000-0000-0000-000000000000	392225b5-b0f5-4786-aba5-423933f4fef3	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"aamir.ibrinfotech@gmail.com","user_id":"f0f6c256-52fc-482c-8dcf-b04a6ae063d9","user_phone":""}}	2025-10-24 10:40:43.682993+00	
00000000-0000-0000-0000-000000000000	51987a36-d967-427a-a627-c1f73045cb7b	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-24 11:39:38.531902+00	
00000000-0000-0000-0000-000000000000	6b736c85-2263-499f-8d1f-e2bf059f1014	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-24 11:42:44.61254+00	
00000000-0000-0000-0000-000000000000	06b02775-b60f-41f2-bc68-739670c79ef0	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 12:36:50.690902+00	
00000000-0000-0000-0000-000000000000	3a89c905-f6b2-4143-8377-cae1a7f59065	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 12:36:50.694288+00	
00000000-0000-0000-0000-000000000000	d2b005ab-a980-4c0d-83f3-47e901d60c06	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 12:56:38.731659+00	
00000000-0000-0000-0000-000000000000	9b49235b-ccd7-4f86-abee-a2f90c0aec01	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 12:56:38.733152+00	
00000000-0000-0000-0000-000000000000	191e623e-0a81-49bb-ae3a-1268ecaae312	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 13:06:33.70993+00	
00000000-0000-0000-0000-000000000000	3f58d307-416a-41ca-9d58-93b26b6566d4	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 13:06:33.711965+00	
00000000-0000-0000-0000-000000000000	e7af06a4-2ce9-46bf-954e-a0ee5c730470	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 04:54:59.66199+00	
00000000-0000-0000-0000-000000000000	e549ec39-57bd-4dc0-854e-c222c9a89b07	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 04:54:59.673155+00	
00000000-0000-0000-0000-000000000000	896119c1-da0f-4ae9-a679-e94fe731dea1	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 04:58:11.495968+00	
00000000-0000-0000-0000-000000000000	d222fe94-d610-433f-838a-d5e242d0e6f6	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 04:58:11.497635+00	
00000000-0000-0000-0000-000000000000	8aad8edc-3401-479f-adc3-4f5bef02b762	{"action":"user_confirmation_requested","actor_id":"1e01aef8-f5ff-40a1-8451-7e675957b424","actor_username":"abhi@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-27 05:51:16.655351+00	
00000000-0000-0000-0000-000000000000	220ef61c-a338-4a86-9658-4311e5dffb2e	{"action":"logout","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account"}	2025-10-27 05:52:06.314279+00	
00000000-0000-0000-0000-000000000000	7770af0e-d9e6-44d9-883e-3a9c8a5a9c75	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-27 05:52:25.939487+00	
00000000-0000-0000-0000-000000000000	e6284956-0ccf-4792-b511-770d860cb53b	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-27 05:52:44.276965+00	
00000000-0000-0000-0000-000000000000	352c271a-72a9-4add-a293-5181b15edbb1	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 06:51:09.425765+00	
00000000-0000-0000-0000-000000000000	ee2431e9-b37a-4c85-afa6-acee567154c2	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 06:51:09.427428+00	
00000000-0000-0000-0000-000000000000	7b7e715b-f631-4032-815d-44ed8876e7c0	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 07:06:54.959519+00	
00000000-0000-0000-0000-000000000000	f163d939-8228-449c-9a75-c090e042a89d	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 07:06:54.964509+00	
00000000-0000-0000-0000-000000000000	b3118ccf-44c2-4ae2-ba80-0cb2a4d5bbbe	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 07:06:55.147603+00	
00000000-0000-0000-0000-000000000000	1b91c566-2c58-40b9-9b9f-087b51b2f0f8	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 08:04:39.786369+00	
00000000-0000-0000-0000-000000000000	f7fa1a3d-5164-42d0-b760-2bc2f39f1881	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 08:04:39.788706+00	
00000000-0000-0000-0000-000000000000	6c730ead-914e-4e09-ba70-a250ba618b35	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 08:08:38.743007+00	
00000000-0000-0000-0000-000000000000	2199a4c8-6c59-4c52-b3fc-92e5b03e8fda	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 08:08:38.745037+00	
00000000-0000-0000-0000-000000000000	112bdbeb-ed54-440c-b11f-ad540bdf106f	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 09:06:55.678981+00	
00000000-0000-0000-0000-000000000000	e651b38b-8b33-45d8-991a-65cdac40cfad	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 09:06:55.680873+00	
00000000-0000-0000-0000-000000000000	c0869584-c2d7-46e6-9f94-d0e2a8b4bd82	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 09:07:25.827499+00	
00000000-0000-0000-0000-000000000000	34e9d9ba-0f45-4196-b4b0-cbb58400a1ea	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 09:07:25.829143+00	
00000000-0000-0000-0000-000000000000	4a50ef9f-aca2-4bdc-993a-a0652eb927f0	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"user+1@example.com","user_id":"5fc9797d-2dd8-4d80-ad3b-7911d24dffad","user_phone":""}}	2025-10-27 10:02:23.364562+00	
00000000-0000-0000-0000-000000000000	86a22ef4-b887-4b1e-bc58-ffc47a9aa544	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"aamir.ibrinfotech@gmail.com","user_id":"f0f6c256-52fc-482c-8dcf-b04a6ae063d9","user_phone":""}}	2025-10-27 10:03:11.881136+00	
00000000-0000-0000-0000-000000000000	7857223c-0f3f-4ea7-bf29-b2a3e4a234bf	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"aamir.ibrinfotech@gmail.com","user_id":"f0f6c256-52fc-482c-8dcf-b04a6ae063d9","user_phone":""}}	2025-10-27 10:03:13.425772+00	
00000000-0000-0000-0000-000000000000	680cebe5-4c11-4fbf-b17f-6c0b97ee0760	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"user+1@example.com","user_id":"5fc9797d-2dd8-4d80-ad3b-7911d24dffad","user_phone":""}}	2025-10-27 10:04:22.509789+00	
00000000-0000-0000-0000-000000000000	afeaaecc-2639-48b6-a11e-a3ce00a82dc3	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"user+1@example.com","user_id":"5fc9797d-2dd8-4d80-ad3b-7911d24dffad","user_phone":""}}	2025-10-27 10:04:24.303593+00	
00000000-0000-0000-0000-000000000000	63a8d860-82d6-4186-83a8-4f7d4e911cd8	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"parivesh@ibrinfotech.com","user_id":"2f393221-61ad-47e8-aee4-3ecdff2d6247","user_phone":""}}	2025-10-27 10:05:02.760611+00	
00000000-0000-0000-0000-000000000000	6eceed9d-3718-4518-a4b5-be4854dee9ca	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"parivesh@ibrinfotech.com","user_id":"2f393221-61ad-47e8-aee4-3ecdff2d6247","user_phone":""}}	2025-10-27 10:05:05.72613+00	
00000000-0000-0000-0000-000000000000	06791907-0edc-41c9-92fe-56f0b5b8971d	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"parivesh@ibrinfotech.com","user_id":"2f393221-61ad-47e8-aee4-3ecdff2d6247","user_phone":""}}	2025-10-27 10:05:08.344571+00	
00000000-0000-0000-0000-000000000000	7489fc81-ce9f-4e4a-83ae-e4d4d3e0a8a9	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"parivesh@ibrinfotech.com","user_id":"2f393221-61ad-47e8-aee4-3ecdff2d6247","user_phone":""}}	2025-10-27 10:05:12.054617+00	
00000000-0000-0000-0000-000000000000	7c8ea4f0-2881-4add-89fa-6a30ad440185	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 10:05:28.729076+00	
00000000-0000-0000-0000-000000000000	3b202621-3586-48df-9825-21039cc031db	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 10:05:28.730246+00	
00000000-0000-0000-0000-000000000000	844ec039-fa80-458d-9c0c-a5e90c5b2adf	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 10:05:29.098784+00	
00000000-0000-0000-0000-000000000000	49b05b1d-010c-4168-b85b-905890119363	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 10:09:42.861434+00	
00000000-0000-0000-0000-000000000000	8c1e1e50-18ef-42c2-af60-06423c62373d	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 10:09:42.863791+00	
00000000-0000-0000-0000-000000000000	44b8c30c-80c9-4c4f-9752-0fe5b4f9bbcb	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"user+1@example.com","user_id":"5fc9797d-2dd8-4d80-ad3b-7911d24dffad","user_phone":""}}	2025-10-27 10:18:36.044956+00	
00000000-0000-0000-0000-000000000000	d4b4c4ab-3627-4f48-8aa3-eaf001bfe6ff	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"user+1@example.com","user_id":"5fc9797d-2dd8-4d80-ad3b-7911d24dffad","user_phone":""}}	2025-10-27 10:18:38.26882+00	
00000000-0000-0000-0000-000000000000	16cad07e-7da6-4a4a-9b3f-d29087a9ec56	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"aamir.ibrinfotech@gmail.com","user_id":"f0f6c256-52fc-482c-8dcf-b04a6ae063d9","user_phone":""}}	2025-10-27 10:19:13.388999+00	
00000000-0000-0000-0000-000000000000	f7a1e44d-3ffc-45cd-a08a-86291753a1f7	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"aamir.ibrinfotech@gmail.com","user_id":"f0f6c256-52fc-482c-8dcf-b04a6ae063d9","user_phone":""}}	2025-10-27 10:19:14.909465+00	
00000000-0000-0000-0000-000000000000	3a22d0a2-35e4-4fe5-bca2-780f75a4b464	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"aamir.ibrinfotech@gmail.com","user_id":"f0f6c256-52fc-482c-8dcf-b04a6ae063d9","user_phone":""}}	2025-10-27 10:20:44.336748+00	
00000000-0000-0000-0000-000000000000	618d1535-8785-4e7f-8f9b-992cce128967	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"aamir.ibrinfotech@gmail.com","user_id":"f0f6c256-52fc-482c-8dcf-b04a6ae063d9","user_phone":""}}	2025-10-27 10:20:56.651623+00	
00000000-0000-0000-0000-000000000000	f68b27b8-3b0a-4e45-af09-c2fa39ba01f6	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"aamir.ibrinfotech@gmail.com","user_id":"f0f6c256-52fc-482c-8dcf-b04a6ae063d9","user_phone":""}}	2025-10-27 10:21:43.762779+00	
00000000-0000-0000-0000-000000000000	e6b720f3-0f46-4810-a153-a86065f6532d	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"aamir.ibrinfotech@gmail.com","user_id":"f0f6c256-52fc-482c-8dcf-b04a6ae063d9","user_phone":""}}	2025-10-27 10:40:32.842746+00	
00000000-0000-0000-0000-000000000000	ae7d6523-0bd8-4ceb-899e-b8924ddb3566	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"aamir.ibrinfotech@gmail.com","user_id":"f0f6c256-52fc-482c-8dcf-b04a6ae063d9","user_phone":""}}	2025-10-27 10:40:37.013756+00	
00000000-0000-0000-0000-000000000000	c437c126-99cd-4e6e-b8cd-6943731b7012	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"aamir.ibrinfotech@gmail.com","user_id":"f0f6c256-52fc-482c-8dcf-b04a6ae063d9","user_phone":""}}	2025-10-27 10:40:48.876091+00	
00000000-0000-0000-0000-000000000000	e0c9739b-8bc7-4778-8abe-b7e833d3cc91	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"aamir.ibrinfotech@gmail.com","user_id":"f0f6c256-52fc-482c-8dcf-b04a6ae063d9","user_phone":""}}	2025-10-27 10:40:56.891004+00	
00000000-0000-0000-0000-000000000000	f6b6b784-a9dd-4180-9cdf-3f0524ec52ce	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"aamir.ibrinfotech@gmail.com","user_id":"f0f6c256-52fc-482c-8dcf-b04a6ae063d9","user_phone":""}}	2025-10-27 10:42:34.594393+00	
00000000-0000-0000-0000-000000000000	5f0ddd3d-d123-42f6-bc97-214f6c388c9e	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"aamir.ibrinfotech@gmail.com","user_id":"f0f6c256-52fc-482c-8dcf-b04a6ae063d9","user_phone":""}}	2025-10-27 10:42:36.355055+00	
00000000-0000-0000-0000-000000000000	d05976ee-3f23-4c38-ba8e-f9ac6b336b80	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"aamir.ibrinfotech@gmail.com","user_id":"f0f6c256-52fc-482c-8dcf-b04a6ae063d9","user_phone":""}}	2025-10-27 10:42:40.772903+00	
00000000-0000-0000-0000-000000000000	b139839b-a6e8-4939-b9d6-6a6ad1b3d501	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"aamir.ibrinfotech@gmail.com","user_id":"f0f6c256-52fc-482c-8dcf-b04a6ae063d9","user_phone":""}}	2025-10-27 10:43:05.989291+00	
00000000-0000-0000-0000-000000000000	fd23b65b-386e-470e-85cf-1b0c06358cf8	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"aamir.ibrinfotech@gmail.com","user_id":"f0f6c256-52fc-482c-8dcf-b04a6ae063d9","user_phone":""}}	2025-10-27 10:43:07.767184+00	
00000000-0000-0000-0000-000000000000	ac1331af-1fe5-497c-9c59-8c0ae2503ef9	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"aamir.ibrinfotech@gmail.com","user_id":"f0f6c256-52fc-482c-8dcf-b04a6ae063d9","user_phone":""}}	2025-10-27 10:45:24.812211+00	
00000000-0000-0000-0000-000000000000	40d97e77-7085-4b95-8132-31e2e08d93e6	{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"aamir.ibrinfotech@gmail.com","user_id":"f0f6c256-52fc-482c-8dcf-b04a6ae063d9","user_phone":""}}	2025-10-27 10:45:26.340033+00	
00000000-0000-0000-0000-000000000000	2975956a-1cbe-4e41-9261-390ab572afdd	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 11:05:15.989829+00	
00000000-0000-0000-0000-000000000000	bd36a578-6885-4767-823f-d0e9c3bec5ad	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 11:05:15.992273+00	
00000000-0000-0000-0000-000000000000	b0eaa61e-15cf-49b5-ba58-24fd433775c0	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 11:07:52.873188+00	
00000000-0000-0000-0000-000000000000	9dd5dc8c-afee-4702-825e-4f5b9f6535c2	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 11:07:52.876269+00	
00000000-0000-0000-0000-000000000000	737a6664-d389-49a3-be58-46c1c1c024a7	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 12:03:30.421977+00	
00000000-0000-0000-0000-000000000000	5ee6cab4-3fc0-4de9-8840-8da78d9a39b3	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 12:03:30.424436+00	
00000000-0000-0000-0000-000000000000	10606b5d-3aa1-4f53-9e38-5d19140e5868	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 12:21:23.639939+00	
00000000-0000-0000-0000-000000000000	4e0e3d82-5d9b-4e90-a5fc-ea08e20848b9	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 12:21:23.641942+00	
00000000-0000-0000-0000-000000000000	49948a64-a884-4914-b2fa-d7212c6afd2d	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 13:01:58.745848+00	
00000000-0000-0000-0000-000000000000	ff449459-8de9-4607-8446-db9bde725130	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 13:01:58.75567+00	
00000000-0000-0000-0000-000000000000	430667d6-8391-4c83-b34e-3ab435b8953f	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 13:20:18.312636+00	
00000000-0000-0000-0000-000000000000	4e199e2d-8c3b-46ab-a090-9a0939da80c2	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-27 13:20:18.314463+00	
00000000-0000-0000-0000-000000000000	fe39a7df-474c-437f-89fc-55bf08107557	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 04:56:52.238385+00	
00000000-0000-0000-0000-000000000000	911140e3-d98b-4a6f-8799-d6cd2f4ed1ed	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 04:56:52.246119+00	
00000000-0000-0000-0000-000000000000	ff567001-9c1d-4fad-87bf-442119eb1de2	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 05:04:03.699119+00	
00000000-0000-0000-0000-000000000000	8def25d4-ddc6-4942-9012-ba99dbc264eb	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 05:04:03.701478+00	
00000000-0000-0000-0000-000000000000	f5556b9d-c230-440a-b342-dbb66cbe706e	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"user+1@example.com","user_id":"5fc9797d-2dd8-4d80-ad3b-7911d24dffad","user_phone":""}}	2025-10-28 05:06:53.6076+00	
00000000-0000-0000-0000-000000000000	fb1b1844-18f4-4523-9e6a-9ee4343512f5	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"user@example.com","user_id":"2f92b15d-8064-45f2-b0ca-559eb55f32b0","user_phone":""}}	2025-10-28 05:15:14.911103+00	
00000000-0000-0000-0000-000000000000	0a118ec8-4e1b-4a70-96b4-f906e9fa7e5d	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 05:57:03.194057+00	
00000000-0000-0000-0000-000000000000	ff93f06a-214d-4208-bde5-5f13094489e2	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 05:57:03.19632+00	
00000000-0000-0000-0000-000000000000	9cc83d95-399d-416c-99d1-70ca66d05427	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 06:03:00.235462+00	
00000000-0000-0000-0000-000000000000	059b6d85-311f-4610-b903-c7bf273f2e72	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 06:03:00.247588+00	
00000000-0000-0000-0000-000000000000	3c345166-c9bd-4449-baaf-ddfda2bf13c1	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 06:03:00.321539+00	
00000000-0000-0000-0000-000000000000	5163397d-be13-4faa-86b8-d0442c9a7e59	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-28 06:35:37.066944+00	
00000000-0000-0000-0000-000000000000	27d95a2e-a785-42f2-88fa-9e9d9a780d69	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 06:56:29.733035+00	
00000000-0000-0000-0000-000000000000	3874fb5c-2693-4d83-8be7-4524bccefe37	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 06:56:29.734485+00	
00000000-0000-0000-0000-000000000000	680da134-9c14-4135-a143-65a51ec79cc4	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 07:01:35.091836+00	
00000000-0000-0000-0000-000000000000	4fd8393b-5fdd-4c06-8d05-66e649707fe4	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 07:01:35.09416+00	
00000000-0000-0000-0000-000000000000	c2cca814-853e-432b-b1fa-d59b89efe6b0	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 07:55:28.684775+00	
00000000-0000-0000-0000-000000000000	06b248b8-7636-452b-8928-b34cb01322e0	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 07:55:28.68669+00	
00000000-0000-0000-0000-000000000000	2981eef1-9506-47e7-ba57-85d6bf267d54	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 07:58:55.947472+00	
00000000-0000-0000-0000-000000000000	c2b5ed58-1005-4aad-855a-ad6f42cc05b4	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 07:58:55.952661+00	
00000000-0000-0000-0000-000000000000	7550d8b3-79dd-4529-933a-16d70e18f24b	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 08:03:40.344112+00	
00000000-0000-0000-0000-000000000000	9843aecb-ab08-4dca-bb9f-50a4260dd424	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 08:03:40.346827+00	
00000000-0000-0000-0000-000000000000	f322eb49-ac12-4d0c-8e7b-1940d50f8486	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 08:03:40.440249+00	
00000000-0000-0000-0000-000000000000	8c84b19e-69af-4500-850a-cccf06a234be	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 09:01:15.424594+00	
00000000-0000-0000-0000-000000000000	99823f0e-e6c6-46ad-8476-3cdcf2de1a74	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 09:01:15.427258+00	
00000000-0000-0000-0000-000000000000	28de0f52-68f8-4f98-b189-e31017c78b1c	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 09:02:39.23499+00	
00000000-0000-0000-0000-000000000000	0fba68c3-e79c-409f-b8c6-ab7fb541cbdf	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 09:02:39.236037+00	
00000000-0000-0000-0000-000000000000	5871c873-3a1f-46fa-ba92-dd555a250295	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 09:02:39.596298+00	
00000000-0000-0000-0000-000000000000	6646f022-81cc-4659-8824-c0c2d1b6a6c1	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"alice.smith@example.com","user_id":"654f35de-4bd1-43d4-92ec-922fa381f015","user_phone":""}}	2025-10-28 09:24:15.256341+00	
00000000-0000-0000-0000-000000000000	a8a2a7dd-4eac-480e-9e94-58d8d70a31d6	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"alice.smith@example.com","user_id":"8495e061-937f-446a-a697-630f610b8e72","user_phone":""}}	2025-10-28 09:24:36.320218+00	
00000000-0000-0000-0000-000000000000	1edd216e-ce20-4beb-bd46-17f1c1562837	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"abhi@gmail.com","user_id":"1e01aef8-f5ff-40a1-8451-7e675957b424","user_phone":""}}	2025-10-28 09:25:17.760143+00	
00000000-0000-0000-0000-000000000000	06abd360-af25-4588-a4ed-76075732be1e	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"abhi@gmail.com","user_id":"e525a509-4758-464a-9edc-efcec900d106","user_phone":""}}	2025-10-28 09:25:33.941392+00	
00000000-0000-0000-0000-000000000000	e4f509f9-ea07-41b8-962f-182352d515c7	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"abhi2@gmail.com","user_id":"15b74b11-a982-4e43-8e7d-002f0cd2c11e","user_phone":""}}	2025-10-28 09:26:06.109007+00	
00000000-0000-0000-0000-000000000000	a0306e17-1426-42c5-bdac-dbedef5ac0af	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 09:27:37.329009+00	
00000000-0000-0000-0000-000000000000	0e06593f-6bc3-4164-8c1b-af25d32b1f64	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 09:27:37.330259+00	
00000000-0000-0000-0000-000000000000	3992a7a3-f418-4e03-b269-996bc539e8c0	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 09:59:40.461472+00	
00000000-0000-0000-0000-000000000000	0f420dd7-e561-4096-8e75-625bc6e52f22	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 09:59:40.464067+00	
00000000-0000-0000-0000-000000000000	c405ffeb-683b-402e-b067-0ef646a67d40	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 10:01:13.049526+00	
00000000-0000-0000-0000-000000000000	a310db19-5cd4-4b77-aeed-500ed16d6053	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 10:01:13.052224+00	
00000000-0000-0000-0000-000000000000	b1c75788-f552-4caa-be43-892693ac465e	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 10:59:23.465474+00	
00000000-0000-0000-0000-000000000000	bd633315-a6cc-49ea-8089-916ddd5ae8af	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 10:59:23.474486+00	
00000000-0000-0000-0000-000000000000	531dbff8-c1ab-486b-87d9-4fc9380bab22	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 10:59:24.30352+00	
00000000-0000-0000-0000-000000000000	548a23b0-2d19-42ce-add5-3757f58d512e	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 10:59:43.775266+00	
00000000-0000-0000-0000-000000000000	eb0041ca-7ec0-412b-a1c8-a368812247b0	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 10:59:43.776129+00	
00000000-0000-0000-0000-000000000000	291875b8-dd38-459b-8bcd-6ed07edf6b33	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 11:58:23.29632+00	
00000000-0000-0000-0000-000000000000	c4a390b9-7b6c-41a7-b34e-dd191c01a4ab	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 11:58:23.297901+00	
00000000-0000-0000-0000-000000000000	befd97eb-15a4-44b8-94ba-97c1bca5efff	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 12:01:08.847667+00	
00000000-0000-0000-0000-000000000000	53c69aa2-df5f-49d0-9f38-5842fbdf3f22	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 12:01:08.849584+00	
00000000-0000-0000-0000-000000000000	ec8717df-8c81-4a37-9a4e-e1acc03d6f92	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 12:01:12.525866+00	
00000000-0000-0000-0000-000000000000	fcb5ec79-7351-40a4-b448-479ceac6f10f	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"sharmaji@gmail.com","user_id":"bb6291cb-fc15-4756-827d-7965ace6cf5e","user_phone":""}}	2025-10-28 12:47:42.05647+00	
00000000-0000-0000-0000-000000000000	6ff34dad-6a6b-4450-baa0-772a19d3430b	{"action":"login","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-28 12:49:24.38717+00	
00000000-0000-0000-0000-000000000000	34ea1baa-69cd-4529-902d-08969fd5640e	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 12:56:50.388776+00	
00000000-0000-0000-0000-000000000000	f59000bf-cb17-42b4-9ea9-5f0db0ec34fc	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 12:56:50.390689+00	
00000000-0000-0000-0000-000000000000	1e98b87e-da02-4eb1-b190-77e8f33161f4	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 12:59:29.068221+00	
00000000-0000-0000-0000-000000000000	992358ee-feeb-48a2-8009-530d7d713cba	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 12:59:29.070504+00	
00000000-0000-0000-0000-000000000000	7866954c-4c36-4e59-9961-51a501ae88ef	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"sharmajikaladka@gmail.com","user_id":"e8b5f27d-ccc5-43b8-b54e-67d5deacb26c","user_phone":""}}	2025-10-28 12:59:55.984935+00	
00000000-0000-0000-0000-000000000000	0734bdef-a371-4d43-a613-0256170174ef	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 12:54:22.39361+00	
00000000-0000-0000-0000-000000000000	7e9b1296-6e6f-4193-be91-dd4295431617	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-28 12:54:22.396373+00	
00000000-0000-0000-0000-000000000000	d64701be-5117-4649-a91b-e9fd0c5a66ae	{"action":"token_refreshed","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-29 04:55:04.649925+00	
00000000-0000-0000-0000-000000000000	4295fbe7-e975-4582-8716-78b62a2424b6	{"action":"token_revoked","actor_id":"27325589-065e-45a4-be45-fdb4a6a0c3bf","actor_username":"admin@example.com","actor_via_sso":false,"log_type":"token"}	2025-10-29 04:55:04.659784+00	
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
9b06e4b3-1e92-4e8c-aa76-7b5487a97eeb	7bafe679-b26b-4191-83b3-e46febde102e	f11de4c4-7b71-40a9-b728-07f812a618ab	s256	9RiD1aCRe3I_dXFP6yVUqzLa97qQ6WQH3A96YZkajss	email			2025-10-17 07:55:33.790406+00	2025-10-17 07:55:33.790406+00	email/signup	\N
cf8586b0-8216-45de-b997-9b738bc2ea04	38db20e5-47d3-4f28-9733-8f10623d8866	defd1d49-1c9e-4012-b1e4-6333e3f2adb2	s256	fOtXEUrnUw0qZHpjBF4iQfuDqeubwSfnRYXArmnYUac	email			2025-10-17 07:59:27.318107+00	2025-10-17 07:59:27.318107+00	email/signup	\N
962500f8-425e-4abd-8bfe-1c81c3658080	27325589-065e-45a4-be45-fdb4a6a0c3bf	47a15059-4616-4d86-aef1-128e490bc4af	s256	8kv67_AakfBOnG1_QFOBDvRGTwnsjm98bZw_SDxtXGs	email			2025-10-17 09:15:00.900997+00	2025-10-17 09:15:00.900997+00	email/signup	\N
1f3f323e-e7cd-4b43-8dd6-fc7b5381e987	27325589-065e-45a4-be45-fdb4a6a0c3bf	c0ff27f3-9c89-4f28-8993-e08adb3ab8a9	s256	J20jMIL3N8kgHLMg_4qWlCqyNPT33vdki-MJsl8Yb1A	email			2025-10-17 09:18:22.670502+00	2025-10-17 09:18:22.670502+00	email/signup	\N
c69a017e-37d4-4835-a5d0-6dac7fa8ec75	27325589-065e-45a4-be45-fdb4a6a0c3bf	83d628ac-5f87-49bb-82bf-6c1b967da1c6	s256	sJj8AnRNql0l1rLLY5wg4MA2c04kOdfVdFfsqtILDG0	email			2025-10-17 09:20:54.063438+00	2025-10-17 09:20:54.063438+00	email/signup	\N
d91cf978-d67d-4a7f-bc42-cdd6db1ef927	27325589-065e-45a4-be45-fdb4a6a0c3bf	a914952a-5c83-40a8-b9e9-f24d1d4bff88	s256	sjlzpI-jjN-Zu72jqcPx6ZPMQij7WOf2XYHGwE1RXaA	email			2025-10-17 09:22:35.578556+00	2025-10-17 09:22:35.578556+00	email/signup	\N
768de36f-cc43-4b62-8b37-60fd07312443	27325589-065e-45a4-be45-fdb4a6a0c3bf	a327f1c9-dd31-4ba5-b91b-ca2197964ed8	s256	JdU1uIduPVjzG-UAoKgjlLRGcw5cxPPHx8WOcNzJSSc	email			2025-10-17 09:23:57.57067+00	2025-10-17 09:23:57.57067+00	email/signup	\N
3022b79b-427d-4abe-9277-1ff85b110dd6	2f393221-61ad-47e8-aee4-3ecdff2d6247	ef92e68e-8050-4297-b8de-2107e68d2519	s256	x30twZTwKvKL_JvP_WlDIwGM88jq0u8S_915H_wAp6Y	email			2025-10-17 09:26:11.402956+00	2025-10-17 09:26:11.402956+00	email/signup	\N
a42f9bef-8eb4-4727-8966-e53ed02bcd52	1e01aef8-f5ff-40a1-8451-7e675957b424	7e3733e2-2ce5-48bb-80ec-9225e2c3eaf0	s256	XVLmz-vrm95po0sN2X2qFs_fpx-8vv6gfFWEk45M03A	email			2025-10-27 05:51:16.657591+00	2025-10-27 05:51:16.657591+00	email/signup	\N
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
27325589-065e-45a4-be45-fdb4a6a0c3bf	27325589-065e-45a4-be45-fdb4a6a0c3bf	{"sub": "27325589-065e-45a4-be45-fdb4a6a0c3bf", "email": "admin@example.com", "email_verified": false, "phone_verified": false}	email	2025-10-17 09:15:00.891764+00	2025-10-17 09:15:00.891895+00	2025-10-17 09:15:00.891895+00	693395f4-5343-43ca-b0b3-e4d9791aae43
2f393221-61ad-47e8-aee4-3ecdff2d6247	2f393221-61ad-47e8-aee4-3ecdff2d6247	{"sub": "2f393221-61ad-47e8-aee4-3ecdff2d6247", "email": "parivesh@ibrinfotech.com", "email_verified": false, "phone_verified": false}	email	2025-10-17 09:26:11.39519+00	2025-10-17 09:26:11.395248+00	2025-10-17 09:26:11.395248+00	64f8173a-2858-4c8d-8258-c103a12315f3
b0cc2354-83a6-417c-ac4c-915914906a20	b0cc2354-83a6-417c-ac4c-915914906a20	{"sub": "b0cc2354-83a6-417c-ac4c-915914906a20", "email": "nikhil.jain@ibrinfotech.com", "email_verified": false, "phone_verified": false}	email	2025-10-24 10:13:10.803082+00	2025-10-24 10:13:10.803195+00	2025-10-24 10:13:10.803195+00	63fa5004-0579-4e55-b8b7-cb5e266383c4
f0f6c256-52fc-482c-8dcf-b04a6ae063d9	f0f6c256-52fc-482c-8dcf-b04a6ae063d9	{"sub": "f0f6c256-52fc-482c-8dcf-b04a6ae063d9", "email": "aamir.ibrinfotech@gmail.com", "email_verified": false, "phone_verified": false}	email	2025-10-24 10:40:43.680136+00	2025-10-24 10:40:43.680292+00	2025-10-24 10:40:43.680292+00	a6029e75-91fc-4b7c-b0c4-86bcb5b4adc3
8495e061-937f-446a-a697-630f610b8e72	8495e061-937f-446a-a697-630f610b8e72	{"sub": "8495e061-937f-446a-a697-630f610b8e72", "email": "alice.smith@example.com", "email_verified": false, "phone_verified": false}	email	2025-10-28 09:24:36.317533+00	2025-10-28 09:24:36.317654+00	2025-10-28 09:24:36.317654+00	4b18c59c-d201-430e-b6dc-dbc89bfc9a99
e525a509-4758-464a-9edc-efcec900d106	e525a509-4758-464a-9edc-efcec900d106	{"sub": "e525a509-4758-464a-9edc-efcec900d106", "email": "abhi@gmail.com", "email_verified": false, "phone_verified": false}	email	2025-10-28 09:25:33.9397+00	2025-10-28 09:25:33.939782+00	2025-10-28 09:25:33.939782+00	b34d9971-6400-4b12-aeb4-22ce9f721b2d
15b74b11-a982-4e43-8e7d-002f0cd2c11e	15b74b11-a982-4e43-8e7d-002f0cd2c11e	{"sub": "15b74b11-a982-4e43-8e7d-002f0cd2c11e", "email": "abhi2@gmail.com", "email_verified": false, "phone_verified": false}	email	2025-10-28 09:26:06.106925+00	2025-10-28 09:26:06.107075+00	2025-10-28 09:26:06.107075+00	ef49c396-2a45-44ce-a310-9334253371b8
bb6291cb-fc15-4756-827d-7965ace6cf5e	bb6291cb-fc15-4756-827d-7965ace6cf5e	{"sub": "bb6291cb-fc15-4756-827d-7965ace6cf5e", "email": "sharmaji@gmail.com", "email_verified": false, "phone_verified": false}	email	2025-10-28 12:47:42.055018+00	2025-10-28 12:47:42.05508+00	2025-10-28 12:47:42.05508+00	636a7710-ffb0-4716-a504-b0626d278f9d
e8b5f27d-ccc5-43b8-b54e-67d5deacb26c	e8b5f27d-ccc5-43b8-b54e-67d5deacb26c	{"sub": "e8b5f27d-ccc5-43b8-b54e-67d5deacb26c", "email": "sharmajikaladka@gmail.com", "email_verified": false, "phone_verified": false}	email	2025-10-28 12:59:55.972545+00	2025-10-28 12:59:55.972653+00	2025-10-28 12:59:55.972653+00	9ad5dc23-7f94-45a3-a233-7f058c8cf7df
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
76291ee6-38d3-4045-ab73-55dd6c14a4af	2025-10-27 05:52:25.954741+00	2025-10-27 05:52:25.954741+00	password	67422b3a-8250-4859-b03b-e999a59178a7
0a7f09d1-7c28-4ddf-a73a-02b642614455	2025-10-27 05:52:44.28223+00	2025-10-27 05:52:44.28223+00	password	d6d618c4-d9f2-4f4c-a547-4662f74d1d9e
3580cb82-4f1f-486a-bc95-78946872596a	2025-10-28 06:35:37.078359+00	2025-10-28 06:35:37.078359+00	password	cb36393e-084f-4ecb-9956-907674f30ddd
6f5322e0-43e1-4b83-9f64-1469d2a079e0	2025-10-28 12:49:24.398495+00	2025-10-28 12:49:24.398495+00	password	8333e2a8-bdad-4a9e-a695-b3fad8ac786a
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
507f0430-8569-48bd-b2e0-7a7478733cce	27325589-065e-45a4-be45-fdb4a6a0c3bf	confirmation_token	pkce_5ae31c89ba0ab11fd3e627de0ce3b4f018ad52c72658273713bf4a60	admin@example.com	2025-10-17 09:23:57.574574	2025-10-17 09:23:57.574574
274fad1a-5cd0-4a94-beb1-6557d1e28dff	2f393221-61ad-47e8-aee4-3ecdff2d6247	confirmation_token	pkce_9112ad1786c9040a145e94490b88aa4deead4a7e395040c5ad1994d6	parivesh@ibrinfotech.com	2025-10-17 09:26:11.406383	2025-10-17 09:26:11.406383
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
00000000-0000-0000-0000-000000000000	72	i45r3ez6su3e	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-27 11:05:15.994933+00	2025-10-27 12:03:30.425788+00	2rfv7vfesmtc	76291ee6-38d3-4045-ab73-55dd6c14a4af
00000000-0000-0000-0000-000000000000	73	b2xws6md6wqp	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-27 11:07:52.878139+00	2025-10-27 12:21:23.64363+00	7hxy3mdimjqi	0a7f09d1-7c28-4ddf-a73a-02b642614455
00000000-0000-0000-0000-000000000000	74	pkzobmniz2j4	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-27 12:03:30.427166+00	2025-10-27 13:01:58.756889+00	i45r3ez6su3e	76291ee6-38d3-4045-ab73-55dd6c14a4af
00000000-0000-0000-0000-000000000000	75	h45ttlvpwanf	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-27 12:21:23.644766+00	2025-10-27 13:20:18.315514+00	b2xws6md6wqp	0a7f09d1-7c28-4ddf-a73a-02b642614455
00000000-0000-0000-0000-000000000000	77	hygqgoh7rbjz	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-27 13:20:18.316828+00	2025-10-28 04:56:52.24759+00	h45ttlvpwanf	0a7f09d1-7c28-4ddf-a73a-02b642614455
00000000-0000-0000-0000-000000000000	76	nuspixhrrpg6	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-27 13:01:58.757903+00	2025-10-28 05:04:03.702909+00	pkzobmniz2j4	76291ee6-38d3-4045-ab73-55dd6c14a4af
00000000-0000-0000-0000-000000000000	78	lqkml2fulffj	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-28 04:56:52.254114+00	2025-10-28 05:57:03.197702+00	hygqgoh7rbjz	0a7f09d1-7c28-4ddf-a73a-02b642614455
00000000-0000-0000-0000-000000000000	79	soz2k66rjeid	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-28 05:04:03.704458+00	2025-10-28 06:03:00.250939+00	nuspixhrrpg6	76291ee6-38d3-4045-ab73-55dd6c14a4af
00000000-0000-0000-0000-000000000000	80	num3rqrww6lz	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-28 05:57:03.19878+00	2025-10-28 06:56:29.735379+00	lqkml2fulffj	0a7f09d1-7c28-4ddf-a73a-02b642614455
00000000-0000-0000-0000-000000000000	81	ze7uo5t5ikkq	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-28 06:03:00.252514+00	2025-10-28 07:01:35.095429+00	soz2k66rjeid	76291ee6-38d3-4045-ab73-55dd6c14a4af
00000000-0000-0000-0000-000000000000	83	3hnhze4ujwu3	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-28 06:56:29.736831+00	2025-10-28 07:55:28.687709+00	num3rqrww6lz	0a7f09d1-7c28-4ddf-a73a-02b642614455
00000000-0000-0000-0000-000000000000	82	c7lk62j3mwg5	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-28 06:35:37.072983+00	2025-10-28 07:58:55.954277+00	\N	3580cb82-4f1f-486a-bc95-78946872596a
00000000-0000-0000-0000-000000000000	84	wuo2uy333cxn	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-28 07:01:35.096325+00	2025-10-28 08:03:40.348415+00	ze7uo5t5ikkq	76291ee6-38d3-4045-ab73-55dd6c14a4af
00000000-0000-0000-0000-000000000000	85	nrhxyjmckogq	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-28 07:55:28.688743+00	2025-10-28 09:01:15.428896+00	3hnhze4ujwu3	0a7f09d1-7c28-4ddf-a73a-02b642614455
00000000-0000-0000-0000-000000000000	87	zmzyofocgeid	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-28 08:03:40.350186+00	2025-10-28 09:02:39.237088+00	wuo2uy333cxn	76291ee6-38d3-4045-ab73-55dd6c14a4af
00000000-0000-0000-0000-000000000000	86	ieajf3geebns	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-28 07:58:55.957054+00	2025-10-28 09:27:37.331034+00	c7lk62j3mwg5	3580cb82-4f1f-486a-bc95-78946872596a
00000000-0000-0000-0000-000000000000	88	fj3nytptpqjm	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-28 09:01:15.430041+00	2025-10-28 09:59:40.465173+00	nrhxyjmckogq	0a7f09d1-7c28-4ddf-a73a-02b642614455
00000000-0000-0000-0000-000000000000	89	6jr75wcvedna	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-28 09:02:39.237642+00	2025-10-28 10:01:13.053483+00	zmzyofocgeid	76291ee6-38d3-4045-ab73-55dd6c14a4af
00000000-0000-0000-0000-000000000000	91	i23jrxrxig5i	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-28 09:59:40.466393+00	2025-10-28 10:59:23.476174+00	fj3nytptpqjm	0a7f09d1-7c28-4ddf-a73a-02b642614455
00000000-0000-0000-0000-000000000000	92	sm4ql5puufsh	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-28 10:01:13.054406+00	2025-10-28 10:59:43.777104+00	6jr75wcvedna	76291ee6-38d3-4045-ab73-55dd6c14a4af
00000000-0000-0000-0000-000000000000	94	u7orubxdbolq	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-28 10:59:43.777688+00	2025-10-28 11:58:23.298993+00	sm4ql5puufsh	76291ee6-38d3-4045-ab73-55dd6c14a4af
00000000-0000-0000-0000-000000000000	63	2s3wac73dlk5	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-27 05:52:44.280025+00	2025-10-27 06:51:09.428388+00	\N	0a7f09d1-7c28-4ddf-a73a-02b642614455
00000000-0000-0000-0000-000000000000	62	cqis5xuwkaxj	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-27 05:52:25.950851+00	2025-10-27 07:06:54.966243+00	\N	76291ee6-38d3-4045-ab73-55dd6c14a4af
00000000-0000-0000-0000-000000000000	93	utdnmap7dvug	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-28 10:59:23.477912+00	2025-10-28 12:01:08.851136+00	i23jrxrxig5i	0a7f09d1-7c28-4ddf-a73a-02b642614455
00000000-0000-0000-0000-000000000000	64	otdybxmbov25	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-27 06:51:09.429228+00	2025-10-27 08:04:39.790364+00	2s3wac73dlk5	0a7f09d1-7c28-4ddf-a73a-02b642614455
00000000-0000-0000-0000-000000000000	65	4rqaj5d5fcls	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-27 07:06:54.969199+00	2025-10-27 08:08:38.746005+00	cqis5xuwkaxj	76291ee6-38d3-4045-ab73-55dd6c14a4af
00000000-0000-0000-0000-000000000000	97	rwgs3tbq74ab	27325589-065e-45a4-be45-fdb4a6a0c3bf	f	2025-10-28 12:49:24.395277+00	2025-10-28 12:49:24.395277+00	\N	6f5322e0-43e1-4b83-9f64-1469d2a079e0
00000000-0000-0000-0000-000000000000	67	x6j6jjs3w2ge	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-27 08:08:38.746901+00	2025-10-27 09:06:55.681938+00	4rqaj5d5fcls	76291ee6-38d3-4045-ab73-55dd6c14a4af
00000000-0000-0000-0000-000000000000	90	htfftgb5a7dx	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-28 09:27:37.331892+00	2025-10-28 12:54:22.397352+00	ieajf3geebns	3580cb82-4f1f-486a-bc95-78946872596a
00000000-0000-0000-0000-000000000000	98	3slda6xvz6to	27325589-065e-45a4-be45-fdb4a6a0c3bf	f	2025-10-28 12:54:22.399118+00	2025-10-28 12:54:22.399118+00	htfftgb5a7dx	3580cb82-4f1f-486a-bc95-78946872596a
00000000-0000-0000-0000-000000000000	66	g5s22gjysqed	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-27 08:04:39.791644+00	2025-10-27 09:07:25.83023+00	otdybxmbov25	0a7f09d1-7c28-4ddf-a73a-02b642614455
00000000-0000-0000-0000-000000000000	95	h7x5crvsuk3d	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-28 11:58:23.300068+00	2025-10-28 12:56:50.392253+00	u7orubxdbolq	76291ee6-38d3-4045-ab73-55dd6c14a4af
00000000-0000-0000-0000-000000000000	68	ihw7n5l6qz2k	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-27 09:06:55.68298+00	2025-10-27 10:05:28.731165+00	x6j6jjs3w2ge	76291ee6-38d3-4045-ab73-55dd6c14a4af
00000000-0000-0000-0000-000000000000	69	uycyjb2pjwen	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-27 09:07:25.831322+00	2025-10-27 10:09:42.865141+00	g5s22gjysqed	0a7f09d1-7c28-4ddf-a73a-02b642614455
00000000-0000-0000-0000-000000000000	96	3rl6xltuluys	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-28 12:01:08.852384+00	2025-10-28 12:59:29.071721+00	utdnmap7dvug	0a7f09d1-7c28-4ddf-a73a-02b642614455
00000000-0000-0000-0000-000000000000	70	2rfv7vfesmtc	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-27 10:05:28.743843+00	2025-10-27 11:05:15.993574+00	ihw7n5l6qz2k	76291ee6-38d3-4045-ab73-55dd6c14a4af
00000000-0000-0000-0000-000000000000	71	7hxy3mdimjqi	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-27 10:09:42.866172+00	2025-10-27 11:07:52.877293+00	uycyjb2pjwen	0a7f09d1-7c28-4ddf-a73a-02b642614455
00000000-0000-0000-0000-000000000000	100	ydkt5yego4ja	27325589-065e-45a4-be45-fdb4a6a0c3bf	f	2025-10-28 12:59:29.073071+00	2025-10-28 12:59:29.073071+00	3rl6xltuluys	0a7f09d1-7c28-4ddf-a73a-02b642614455
00000000-0000-0000-0000-000000000000	99	ehyzyoaksi3q	27325589-065e-45a4-be45-fdb4a6a0c3bf	t	2025-10-28 12:56:50.393579+00	2025-10-29 04:55:04.660736+00	h7x5crvsuk3d	76291ee6-38d3-4045-ab73-55dd6c14a4af
00000000-0000-0000-0000-000000000000	101	gk7uuvemnmni	27325589-065e-45a4-be45-fdb4a6a0c3bf	f	2025-10-29 04:55:04.668887+00	2025-10-29 04:55:04.668887+00	ehyzyoaksi3q	76291ee6-38d3-4045-ab73-55dd6c14a4af
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag) FROM stdin;
6f5322e0-43e1-4b83-9f64-1469d2a079e0	27325589-065e-45a4-be45-fdb4a6a0c3bf	2025-10-28 12:49:24.391242+00	2025-10-28 12:49:24.391242+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	106.222.212.28	\N
3580cb82-4f1f-486a-bc95-78946872596a	27325589-065e-45a4-be45-fdb4a6a0c3bf	2025-10-28 06:35:37.069204+00	2025-10-28 12:54:22.408152+00	\N	aal1	\N	2025-10-28 12:54:22.408075	Next.js Middleware	10.0.1.1	\N
0a7f09d1-7c28-4ddf-a73a-02b642614455	27325589-065e-45a4-be45-fdb4a6a0c3bf	2025-10-27 05:52:44.278529+00	2025-10-28 12:59:29.077876+00	\N	aal1	\N	2025-10-28 12:59:29.077674	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	106.222.212.28	\N
76291ee6-38d3-4045-ab73-55dd6c14a4af	27325589-065e-45a4-be45-fdb4a6a0c3bf	2025-10-27 05:52:25.947343+00	2025-10-29 04:55:04.683943+00	\N	aal1	\N	2025-10-29 04:55:04.683594	Next.js Middleware	106.222.212.28	\N
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	2f393221-61ad-47e8-aee4-3ecdff2d6247	authenticated	authenticated	parivesh@ibrinfotech.com	$2a$10$LC7l5Ae2YigazMAANVtSqu/vwwLdJzagh1IDAmp7Nw5W87PHN/YZm	\N	\N	pkce_9112ad1786c9040a145e94490b88aa4deead4a7e395040c5ad1994d6	2025-10-17 09:26:11.404558+00		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"sub": "2f393221-61ad-47e8-aee4-3ecdff2d6247", "email": "parivesh@ibrinfotech.com", "email_verified": false, "phone_verified": false}	\N	2025-10-17 09:26:11.389543+00	2025-10-17 09:26:11.405122+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	b0cc2354-83a6-417c-ac4c-915914906a20	authenticated	authenticated	nikhil.jain@ibrinfotech.com	$2a$10$gfpaLw8vT4lwmgysuYVmheC7Vv2UiHqED65fn7Xx9kxEmqpYF6tcS	2025-10-24 10:13:10.807645+00	\N		\N		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-10-24 10:13:10.798586+00	2025-10-24 10:13:10.809004+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	15b74b11-a982-4e43-8e7d-002f0cd2c11e	authenticated	authenticated	abhi2@gmail.com	$2a$10$qqYJ9bnGDiOpMJ6h7rjPSuf18ujE2KduTshD/g9LBC.e5AeB6z74u	2025-10-28 09:26:06.111407+00	\N		\N		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-10-28 09:26:06.10379+00	2025-10-28 09:26:06.112849+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	bb6291cb-fc15-4756-827d-7965ace6cf5e	authenticated	authenticated	sharmaji@gmail.com	$2a$10$orCxTBXzEKv7hE0hzt/vZOirWs7AI0C3b57OjtXS.98NtOa6W6hqm	2025-10-28 12:47:42.058205+00	\N		\N		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-10-28 12:47:42.052931+00	2025-10-28 12:47:42.059439+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	f0f6c256-52fc-482c-8dcf-b04a6ae063d9	authenticated	authenticated	aamir.ibrinfotech@gmail.com	$2a$10$Z0Jg7Y0A2lAq54IZ2IwDW.ynYKWVHE9cjdSl7idy5v.KvG7kNirQ2	2025-10-24 10:40:43.685219+00	\N		\N		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-10-24 10:40:43.676118+00	2025-10-24 10:40:43.686846+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	8495e061-937f-446a-a697-630f610b8e72	authenticated	authenticated	alice.smith@example.com	$2a$10$zltfaF0XNH57qQIAviBI.Olt9iGLUzbzoZeNVM3FTftF1Jwvvh4Tq	2025-10-28 09:24:36.323284+00	\N		\N		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-10-28 09:24:36.312301+00	2025-10-28 09:24:36.325961+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	e525a509-4758-464a-9edc-efcec900d106	authenticated	authenticated	abhi@gmail.com	$2a$10$zevOMO/zIu3EZuM1WjupBepPok0ZlC7f45gRUIaov2WLoEu1sSE4S	2025-10-28 09:25:33.942857+00	\N		\N		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-10-28 09:25:33.935818+00	2025-10-28 09:25:33.944157+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	e8b5f27d-ccc5-43b8-b54e-67d5deacb26c	authenticated	authenticated	sharmajikaladka@gmail.com	$2a$10$FW/yhnxMd9mqvDNbf0XAo.PRvmLnNOYdxg2xDUuERJ.NVE1baEjSO	2025-10-28 12:59:55.987081+00	\N		\N		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-10-28 12:59:55.970223+00	2025-10-28 12:59:55.988198+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	27325589-065e-45a4-be45-fdb4a6a0c3bf	authenticated	authenticated	admin@example.com	$2a$10$HD1CsZ8V8A7z876nQPQYquOo92JH2GESYq24lpLykgIOHyW8HCWJi	2025-10-17 09:15:00.885026+00	\N	pkce_5ae31c89ba0ab11fd3e627de0ce3b4f018ad52c72658273713bf4a60	2025-10-17 09:23:57.571788+00		\N			\N	2025-10-28 12:49:24.389855+00	{"provider": "email", "providers": ["email"]}	{"sub": "27325589-065e-45a4-be45-fdb4a6a0c3bf", "email": "admin@example.com", "email_verified": false, "phone_verified": false}	\N	2025-10-17 09:15:00.885026+00	2025-10-29 04:55:04.673201+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--

COPY pgsodium.key (id, status, created, expires, key_type, key_id, key_context, name, associated_data, raw_key, raw_key_nonce, parent_key, comment, user_data) FROM stdin;
\.


--
-- Data for Name: academic_entries; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.academic_entries (id, enquiry_id, study_level, stream, pursue, score, completion_year, duration_years, completion_date, course) FROM stdin;
c5b70d5a-d2c0-4069-98e2-8e2303a9f4ae	44f9ed5d-f7b6-4327-801b-07a7ff97d99d	bde01205-9954-4c33-a40e-e7d5eedb34cc	1b1f5e0d-7ae2-48bd-9e03-ffcac9a19847	\N	85.00	2025	4	2025-07-01	9e95f38b-4454-4b5b-bce3-db09c24793e8
5d4f0b63-3912-44d2-8984-86bade4f45d8	ae00fdf2-b612-4d3c-8e08-66cc30cfd2dd	bde01205-9954-4c33-a40e-e7d5eedb34cc	1b1f5e0d-7ae2-48bd-9e03-ffcac9a19847	\N	82.00	2025	4	2025-10-28	9e95f38b-4454-4b5b-bce3-db09c24793e8
876c980f-5cde-48c3-975d-8e310aa2ab95	3d90fe91-dc96-444a-96a8-61cb727e48df	818f4897-bf86-469f-a418-a742031565a2	8dc03b1f-46f0-4061-8f8b-3d9afa01bf41	\N	90.00	2025	4	2025-10-28	1fd1149c-f01e-4bdc-baa9-587f803d847b
3170978c-8d61-4311-b97c-bffa8f4d3924	80c8cea2-321e-4978-bf49-179562457966	eeca1ed6-23c4-426f-a1e7-180bbf2a482c	\N	\N	\N	3455	6	2025-10-28	\N
c673010c-569b-49dc-aff9-ff99246f99ae	c7fcaede-7e77-40fc-a657-e063434bab78	\N	\N	\N	\N	\N	\N	\N	\N
ce142962-fbb1-401d-a1a3-f4d6e2e2ccdc	ceb3fbbb-a68f-4daf-ab1a-892ea60868fa	818f4897-bf86-469f-a418-a742031565a2	b6d9f311-753c-4bd6-9b5f-73755dfac6e2	\N	345.00	\N	\N	\N	3a720b3b-3776-48fb-8348-ba6e73b0dc22
209a0ace-f1ea-4312-bfa0-08b3a7894158	c1d8716a-7425-476b-94f4-afb73e6de1b4	818f4897-bf86-469f-a418-a742031565a2	b6d9f311-753c-4bd6-9b5f-73755dfac6e2	\N	345.00	\N	\N	\N	3a720b3b-3776-48fb-8348-ba6e73b0dc22
4c4c0029-a15e-4eea-a553-dbc23639e282	1819023e-f22b-43a2-a0a6-a789ea667fa7	818f4897-bf86-469f-a418-a742031565a2	b6d9f311-753c-4bd6-9b5f-73755dfac6e2	\N	345.00	\N	\N	\N	3a720b3b-3776-48fb-8348-ba6e73b0dc22
5abbc935-04ec-4e60-8d76-abca57cc801c	645945e6-e814-46bc-a0a7-ca6544b0315d	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.courses (id, level_id, course_name, study_area, course_duration, created_at, description) FROM stdin;
d56b43b6-ab1b-4c92-b33b-6823bdd1fb83	bcd5fdb8-97e3-4d80-8b6d-94a73da79216	bachleors in technology	\N	4	2025-10-23 13:29:38.369568+00	\N
643d8e23-2752-4ce7-a5aa-fb32111e04ca	3dbe2f70-7863-47e5-8912-0f375ef24f06	Diploma in Engineering	\N	3	2025-10-24 06:34:14.688622+00	Technical engineering diploma program
eebf3a71-6af8-478b-bdb3-68412481eaa9	3dbe2f70-7863-47e5-8912-0f375ef24f06	Diploma in Computer Applications	\N	3	2025-10-24 06:34:14.688622+00	Computer science and applications diploma
c394bb77-5884-4ac4-a423-a9499e25fb8d	3dbe2f70-7863-47e5-8912-0f375ef24f06	Diploma in Business Management	\N	2	2025-10-24 06:34:14.688622+00	Business administration and management diploma
76d84a85-71a1-4a93-b2b8-7df9cd519a2e	3dbe2f70-7863-47e5-8912-0f375ef24f06	Diploma in Healthcare	\N	3	2025-10-24 06:34:14.688622+00	Healthcare and medical services diploma
81c99399-e74f-4e30-b90a-dc2d25369218	3dbe2f70-7863-47e5-8912-0f375ef24f06	Diploma in Hospitality Management	\N	2	2025-10-24 06:34:14.688622+00	Hotel and hospitality management diploma
ae65ebf7-b3fe-4e15-ae79-4ed0965b39b3	3dbe2f70-7863-47e5-8912-0f375ef24f06	Diploma in Design	\N	2	2025-10-24 06:34:14.688622+00	Creative arts and design diploma
b7d24f15-3b06-44a0-9cc0-f1a67ac6b866	3dbe2f70-7863-47e5-8912-0f375ef24f06	Diploma in Pharmacy	\N	2	2025-10-24 06:34:14.688622+00	Pharmaceutical sciences diploma
db1a5664-f902-4f95-8914-de6a9571cc30	3dbe2f70-7863-47e5-8912-0f375ef24f06	Diploma in Agriculture	\N	2	2025-10-24 06:34:14.688622+00	Agricultural sciences and farming diploma
254965c3-ea1c-4e6a-bd1c-f683d60a7e15	278be01b-5f00-47e1-8a76-ad3b71bfa824	Certificate in Information Technology	\N	1	2025-10-24 06:41:33.679328+00	IT fundamentals and technical skills
5be5e8a1-991d-45ee-b6e1-5ebc30cafd56	278be01b-5f00-47e1-8a76-ad3b71bfa824	Certificate in Digital Marketing	\N	1	2025-10-24 06:41:33.679328+00	Online marketing and social media
2ec4cf15-be36-4149-a518-34652ee568cc	278be01b-5f00-47e1-8a76-ad3b71bfa824	Certificate in Language Skills	\N	1	2025-10-24 06:41:33.679328+00	Language proficiency programs
be709011-f1b4-48f0-b2f5-f6cad24b5c6a	278be01b-5f00-47e1-8a76-ad3b71bfa824	Certificate in Trade Skills	\N	1	2025-10-24 06:41:33.679328+00	Hands-on vocational skills
98bd3a3b-5dd0-4e7d-8986-0e3ee4e3b0cd	278be01b-5f00-47e1-8a76-ad3b71bfa824	Certificate in Business Skills	\N	1	2025-10-24 06:41:33.679328+00	Professional business competencies
3d9f00b0-1024-41c8-aebd-7754d1e9ed2f	278be01b-5f00-47e1-8a76-ad3b71bfa824	Certificate in Creative Arts	\N	1	2025-10-24 06:41:33.679328+00	Arts and creative expression
6b3ef90e-555a-41bb-ac81-e8c08dcb5ea3	278be01b-5f00-47e1-8a76-ad3b71bfa824	Certificate in Health and Safety	\N	1	2025-10-24 06:41:33.679328+00	Workplace health and safety
e8c59e2d-6eac-415f-950b-6fe2af1e92df	bde01205-9954-4c33-a40e-e7d5eedb34cc	Associate of Arts	\N	2	2025-10-24 06:41:33.679328+00	Liberal arts and humanities foundation
9e95f38b-4454-4b5b-bce3-db09c24793e8	bde01205-9954-4c33-a40e-e7d5eedb34cc	Associate of Science	\N	2	2025-10-24 06:41:33.679328+00	Science and mathematics foundation
fc6cb00c-9d97-4bd9-9d3f-c5d050b5af40	bde01205-9954-4c33-a40e-e7d5eedb34cc	Associate of Applied Science	\N	2	2025-10-24 06:41:33.679328+00	Career-focused technical education
14e0ecfc-72ab-4031-9e96-89736c436156	bde01205-9954-4c33-a40e-e7d5eedb34cc	Associate in Business	\N	2	2025-10-24 06:41:33.679328+00	Business administration fundamentals
593a4a4a-4c83-4845-aa32-6193e0620d7e	545405c0-5b36-4a65-bbc2-a09c09c4722e	Vocational Training in Automotive	\N	2	2025-10-24 06:41:33.679328+00	Automotive repair and maintenance training
8b457b92-c402-4355-ad9d-2d4f180fa7b7	545405c0-5b36-4a65-bbc2-a09c09c4722e	Vocational Training in Beauty & Wellness	\N	1	2025-10-24 06:41:33.679328+00	Beauty services and personal care
26d7ddaa-26f5-47a5-81cb-91602d2e410f	545405c0-5b36-4a65-bbc2-a09c09c4722e	Vocational Training in Construction	\N	2	2025-10-24 06:41:33.679328+00	Construction trades and techniques
b99ca97d-9321-480b-beb6-03a95e27b3e1	545405c0-5b36-4a65-bbc2-a09c09c4722e	Vocational Training in Manufacturing	\N	1	2025-10-24 06:41:33.679328+00	Manufacturing processes and operations
f4fcf9a4-a0fc-48d3-8860-e7e706c18df3	545405c0-5b36-4a65-bbc2-a09c09c4722e	Vocational Training in Food Services	\N	1	2025-10-24 06:41:33.679328+00	Food preparation and service
0b684939-ab1c-49a3-b06d-4f38fb0d3882	545405c0-5b36-4a65-bbc2-a09c09c4722e	Vocational Training in Retail	\N	1	2025-10-24 06:41:33.679328+00	Retail operations and sales
261b7232-dbb5-4281-bf60-e83742546486	7bc18bfa-52e0-4ae7-a0ae-cd8e612426d4	Advanced Diploma in Engineering	\N	3	2025-10-24 06:41:33.679328+00	Advanced engineering specializations
1b9e7e3a-5de9-407d-ab2b-dba61da85b0c	7bc18bfa-52e0-4ae7-a0ae-cd8e612426d4	Advanced Diploma in Management	\N	2	2025-10-24 06:41:33.679328+00	Advanced management techniques
7a402bdf-1b5c-4184-ac25-70e00aa066e0	7bc18bfa-52e0-4ae7-a0ae-cd8e612426d4	Advanced Diploma in Information Technology	\N	2	2025-10-24 06:41:33.679328+00	Advanced IT skills and development
cc0f366a-a21c-4371-909d-c99c623d2d57	7bc18bfa-52e0-4ae7-a0ae-cd8e612426d4	Advanced Diploma in Healthcare	\N	2	2025-10-24 06:41:33.679328+00	Specialized healthcare practice
ac84a9f8-d225-47ef-9dfb-3d92bb088f0c	a8b8afff-d1a0-49a7-a52e-8a990f3113dc	Professional IT Certification	\N	1	2025-10-24 06:41:33.679328+00	Industry-standard IT certifications
fe14cdd2-3d7d-4f04-a367-bacc14b76036	a8b8afff-d1a0-49a7-a52e-8a990f3113dc	Professional Financial Certification	\N	1	2025-10-24 06:41:33.679328+00	Financial industry certifications
9a012e3f-b64a-42ec-8c73-2e636653f814	a8b8afff-d1a0-49a7-a52e-8a990f3113dc	Professional Project Management	\N	1	2025-10-24 06:41:33.679328+00	Project management certifications
efe5ee77-77c8-449f-b0bb-4eeaa05a0f92	a8b8afff-d1a0-49a7-a52e-8a990f3113dc	Professional HR Certification	\N	1	2025-10-24 06:41:33.679328+00	Human resources certifications
436dde1e-29a3-4076-bec5-91dfd5fc7a40	07a8d81b-097d-4f3f-bc58-1466f30d3de8	Foundation in Engineering and Technology	\N	1	2025-10-24 06:41:33.679328+00	Preparatory program for engineering studies
c7ebd13c-56ec-4dc9-b70a-abf4e0b90926	07a8d81b-097d-4f3f-bc58-1466f30d3de8	Foundation in Business	\N	1	2025-10-24 06:41:33.679328+00	Preparatory program for business studies
e55d7f4a-111c-4678-b237-12599b86f157	07a8d81b-097d-4f3f-bc58-1466f30d3de8	Foundation in Science	\N	1	2025-10-24 06:41:33.679328+00	Preparatory program for science studies
650b3085-e126-4a01-965c-552d3f31a926	07a8d81b-097d-4f3f-bc58-1466f30d3de8	Foundation in Arts and Humanities	\N	1	2025-10-24 06:41:33.679328+00	Preparatory program for arts and humanities
7cc5da9f-695d-42b8-b943-6137d0517c49	818f4897-bf86-469f-a418-a742031565a2	High School Diploma	\N	4	2025-10-24 06:41:33.679328+00	General secondary education program
1fd1149c-f01e-4bdc-baa9-587f803d847b	818f4897-bf86-469f-a418-a742031565a2	High School with Science Stream	\N	2	2025-10-24 06:41:33.679328+00	Science-focused secondary education
3a720b3b-3776-48fb-8348-ba6e73b0dc22	818f4897-bf86-469f-a418-a742031565a2	High School with Commerce Stream	\N	2	2025-10-24 06:41:33.679328+00	Commerce-focused secondary education
65a81640-ba85-49cd-af0a-5564f2233738	818f4897-bf86-469f-a418-a742031565a2	High School with Arts Stream	\N	2	2025-10-24 06:41:33.679328+00	Arts and humanities focused education
fd32778e-4087-43fa-80cc-3c64a152dd6a	818f4897-bf86-469f-a418-a742031565a2	Technical High School	\N	4	2025-10-24 06:41:33.679328+00	Vocational and technical secondary education
\.


--
-- Data for Name: custom_fields; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.custom_fields (id, created_at, field_name) FROM stdin;
a001e02e-dd5a-4de7-8a0e-21d274ac10a1	2025-10-24 12:58:10.452172+00	IELETS
571f04b6-4420-4765-be93-b26b6f709a7d	2025-10-24 13:20:59.330507+00	gpa
59907e76-5f56-4026-b285-249a6b612f25	2025-10-27 05:59:50.01791+00	10th percentage
544e0819-c622-48fd-bc7e-99fb44927ed8	2025-10-27 06:44:22.222405+00	AddScore
027bd733-8fab-4bdb-8eb2-961ce9885698	2025-10-27 06:44:22.656671+00	Cscrore
41260034-3f3b-4c2d-98df-6df1c6b3be6e	2025-10-27 07:58:09.686049+00	testCustomField
36b26302-e304-4e95-9442-1f5f71ea6b20	2025-10-27 12:43:35.175916+00	The score
b7bba441-9314-4db4-ad48-5c7e81ff64a1	2025-10-28 06:43:21.209633+00	TG Score
565fc472-96a9-481e-96e9-cb6f06af78c1	2025-10-28 06:46:30.796559+00	GT Score
34a7ee30-cc39-4263-b97e-40fb25d80852	2025-10-28 06:56:56.453995+00	ML Score
\.


--
-- Data for Name: custom_programs_fields; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.custom_programs_fields (id, program_id, custom_field, field_value, comparision, created_at) FROM stdin;
a9497f9e-13d2-4b2e-bfc8-4ef7bd3a0eb1	de6f895f-b83d-4a33-b883-1afca549e354	565fc472-96a9-481e-96e9-cb6f06af78c1	45	>	2025-10-28 06:56:56.863562+00
278da975-7f5c-45c2-a9a5-86599bdb8505	de6f895f-b83d-4a33-b883-1afca549e354	b7bba441-9314-4db4-ad48-5c7e81ff64a1	68	>=	2025-10-28 06:56:56.863562+00
1a444da4-71c1-4f2f-b0f5-f219394946c7	de6f895f-b83d-4a33-b883-1afca549e354	34a7ee30-cc39-4263-b97e-40fb25d80852	34	=	2025-10-28 06:56:56.863562+00
0da9abc5-5417-4bc6-89e0-12c27f514dd8	03e9b751-5f99-4cd0-945f-cd384ef27a8f	565fc472-96a9-481e-96e9-cb6f06af78c1	45	<	2025-10-28 06:56:57.262634+00
44e5c5cf-2e2e-47cd-9255-64ac5ff4a8a3	03e9b751-5f99-4cd0-945f-cd384ef27a8f	b7bba441-9314-4db4-ad48-5c7e81ff64a1	98	<=	2025-10-28 06:56:57.262634+00
8c782bac-cc31-4772-99fb-4c6ba7b57834	03e9b751-5f99-4cd0-945f-cd384ef27a8f	34a7ee30-cc39-4263-b97e-40fb25d80852	43	<=	2025-10-28 06:56:57.262634+00
060d0af5-916e-4dca-9257-f9ce69df5dda	dbc4347b-c058-43c5-aaf9-0a76fff12693	34a7ee30-cc39-4263-b97e-40fb25d80852	34	>	2025-10-28 06:56:57.6586+00
c7b1488e-6100-48fb-a0ae-0d7d71fedf81	4366bcc0-0712-4ba3-91a3-c39fdba989b3	565fc472-96a9-481e-96e9-cb6f06af78c1	45	>	2025-10-28 06:56:58.0596+00
963096b2-afbb-43e7-9377-aae691e48f6e	4366bcc0-0712-4ba3-91a3-c39fdba989b3	b7bba441-9314-4db4-ad48-5c7e81ff64a1	128	>=	2025-10-28 06:56:58.0596+00
7d4193cb-581d-49dc-970a-c370234a52ba	4366bcc0-0712-4ba3-91a3-c39fdba989b3	34a7ee30-cc39-4263-b97e-40fb25d80852	5	>=	2025-10-28 06:56:58.0596+00
251e3685-79bb-4020-8b91-19be9f485060	aa900125-4885-4907-87b1-3ab6ec31d5a0	565fc472-96a9-481e-96e9-cb6f06af78c1	45	<	2025-10-28 06:56:58.44504+00
f2eed584-b79c-411c-b040-022477790aed	aa900125-4885-4907-87b1-3ab6ec31d5a0	b7bba441-9314-4db4-ad48-5c7e81ff64a1	158	<=	2025-10-28 06:56:58.44504+00
9ff987e0-7661-4d4a-a805-ed9af3801884	3b794097-1919-4b0f-81aa-dd8db36be53f	565fc472-96a9-481e-96e9-cb6f06af78c1	45	>	2025-10-28 07:17:42.648119+00
9cd3187e-6815-416f-b488-15802f317850	3b794097-1919-4b0f-81aa-dd8db36be53f	b7bba441-9314-4db4-ad48-5c7e81ff64a1	68	>=	2025-10-28 07:17:42.648119+00
97d8e6a7-4ed6-4aa5-a969-be8b9f61e2a8	3b794097-1919-4b0f-81aa-dd8db36be53f	34a7ee30-cc39-4263-b97e-40fb25d80852	34	=	2025-10-28 07:17:42.648119+00
661104a6-b51f-4c16-a8e0-eeaf883fae79	dee95142-25a3-40bc-8c7c-abe17efd6a06	565fc472-96a9-481e-96e9-cb6f06af78c1	45	<	2025-10-28 07:17:43.014404+00
2931fb7f-4be7-42c5-9ba1-986ba126c667	dee95142-25a3-40bc-8c7c-abe17efd6a06	b7bba441-9314-4db4-ad48-5c7e81ff64a1	98	<=	2025-10-28 07:17:43.014404+00
2ca2844b-10f3-4026-a5e0-bf57da98b802	dee95142-25a3-40bc-8c7c-abe17efd6a06	34a7ee30-cc39-4263-b97e-40fb25d80852	43	<=	2025-10-28 07:17:43.014404+00
d27c09f0-1315-46ee-b87b-8ce61347b551	315bfdae-005d-48e2-919c-9ef5187652a1	34a7ee30-cc39-4263-b97e-40fb25d80852	34	>	2025-10-28 07:17:43.385913+00
2569bdba-6e09-4268-bc0d-acfde433d71b	479df2cd-469a-42de-9d9b-87bc1e8507c6	565fc472-96a9-481e-96e9-cb6f06af78c1	45	>	2025-10-28 07:17:43.74584+00
4e7fc670-f421-425e-9090-81204c299662	479df2cd-469a-42de-9d9b-87bc1e8507c6	b7bba441-9314-4db4-ad48-5c7e81ff64a1	128	>=	2025-10-28 07:17:43.74584+00
c4b2e786-b99a-4385-a5ec-77e43534e458	479df2cd-469a-42de-9d9b-87bc1e8507c6	34a7ee30-cc39-4263-b97e-40fb25d80852	5	>=	2025-10-28 07:17:43.74584+00
097aa33c-e4ef-49f4-b33e-70f21f1aa63a	46912b8b-eb06-41af-aae5-ce32bb3917da	565fc472-96a9-481e-96e9-cb6f06af78c1	45	<	2025-10-28 07:17:44.099029+00
af352246-2ac4-4097-9096-55739b157e8f	46912b8b-eb06-41af-aae5-ce32bb3917da	b7bba441-9314-4db4-ad48-5c7e81ff64a1	158	<=	2025-10-28 07:17:44.099029+00
91a0ddce-4e00-40e9-8e00-e03cc3a4a4f3	70e77fcd-20ef-4cac-adc7-668f4356bd74	565fc472-96a9-481e-96e9-cb6f06af78c1	45	>	2025-10-28 07:20:24.326225+00
6de6b7bb-81ba-4702-94f6-a24fc8239d71	70e77fcd-20ef-4cac-adc7-668f4356bd74	b7bba441-9314-4db4-ad48-5c7e81ff64a1	68	>=	2025-10-28 07:20:24.326225+00
7b77394a-dabf-43b6-9b3d-178888ebcc66	70e77fcd-20ef-4cac-adc7-668f4356bd74	34a7ee30-cc39-4263-b97e-40fb25d80852	34	=	2025-10-28 07:20:24.326225+00
134aed32-33ca-4880-915d-9f2512c9b142	5ccd6dfc-eb31-436f-b6fb-37f183304105	565fc472-96a9-481e-96e9-cb6f06af78c1	45	<	2025-10-28 07:20:24.693424+00
1138e666-ed22-419e-b202-a2e5a2b16ff2	5ccd6dfc-eb31-436f-b6fb-37f183304105	b7bba441-9314-4db4-ad48-5c7e81ff64a1	98	<=	2025-10-28 07:20:24.693424+00
e45f0049-5e4f-4dca-9c51-b5de8a7630f4	5ccd6dfc-eb31-436f-b6fb-37f183304105	34a7ee30-cc39-4263-b97e-40fb25d80852	43	<=	2025-10-28 07:20:24.693424+00
cabc0fff-6566-4f04-884a-38568db32f52	ad40595f-98f8-4720-8477-f5e60cb44ecb	34a7ee30-cc39-4263-b97e-40fb25d80852	34	>	2025-10-28 07:20:25.041292+00
73bd2212-e73b-43ca-949c-71e7c030754d	a3f28183-986f-4ff1-9e6c-200269e810d5	565fc472-96a9-481e-96e9-cb6f06af78c1	45	>	2025-10-28 07:20:25.394616+00
201a8dbb-503e-4c47-89e2-cc5876d637f0	a3f28183-986f-4ff1-9e6c-200269e810d5	b7bba441-9314-4db4-ad48-5c7e81ff64a1	128	>=	2025-10-28 07:20:25.394616+00
39f9c195-8671-49ae-99c8-ee863096d29b	a3f28183-986f-4ff1-9e6c-200269e810d5	34a7ee30-cc39-4263-b97e-40fb25d80852	5	>=	2025-10-28 07:20:25.394616+00
ce4eddf4-ea3e-401a-a86a-6375c99b4398	d0e7b189-6f51-4016-9e6c-ee59aefde3e8	565fc472-96a9-481e-96e9-cb6f06af78c1	45	<	2025-10-28 07:20:25.752509+00
d38fd7c9-b869-4a90-9d9b-4d1ce4a51fe0	d0e7b189-6f51-4016-9e6c-ee59aefde3e8	b7bba441-9314-4db4-ad48-5c7e81ff64a1	158	<=	2025-10-28 07:20:25.752509+00
1af98d41-a30e-4748-9857-1de8d1959fd0	df0d688b-7373-4194-96ab-14b933d458e4	565fc472-96a9-481e-96e9-cb6f06af78c1	45	>	2025-10-28 07:22:19.249598+00
f257789d-ad57-4156-9b90-2eda8f112f45	df0d688b-7373-4194-96ab-14b933d458e4	b7bba441-9314-4db4-ad48-5c7e81ff64a1	68	>=	2025-10-28 07:22:19.249598+00
23174b18-4ef6-4538-838b-e9b30c0d7432	df0d688b-7373-4194-96ab-14b933d458e4	34a7ee30-cc39-4263-b97e-40fb25d80852	34	=	2025-10-28 07:22:19.249598+00
78d92901-cfbd-4c00-997c-9a89f7b25ba4	d56421f0-7d30-4e71-8603-aa27b3f2d6d9	565fc472-96a9-481e-96e9-cb6f06af78c1	45	<	2025-10-28 07:22:19.620626+00
b4ee84e7-8814-431b-9624-76eed0c31d6c	d56421f0-7d30-4e71-8603-aa27b3f2d6d9	b7bba441-9314-4db4-ad48-5c7e81ff64a1	98	<=	2025-10-28 07:22:19.620626+00
e0a7ae4b-3632-408e-b32f-e281252abd1e	d56421f0-7d30-4e71-8603-aa27b3f2d6d9	34a7ee30-cc39-4263-b97e-40fb25d80852	43	<=	2025-10-28 07:22:19.620626+00
d0acc588-4e7a-498b-bed5-03993d8984e2	83dc16a5-ae02-4cdb-b617-867377aef5ce	34a7ee30-cc39-4263-b97e-40fb25d80852	34	>	2025-10-28 07:22:19.98116+00
c23afa94-e00a-4189-986a-e5498be7a5f7	40777270-10e2-4057-be5d-720ecf1e64e3	565fc472-96a9-481e-96e9-cb6f06af78c1	45	>	2025-10-28 07:22:20.343131+00
c1154d2e-00b4-4926-9e8f-a9dda3796b73	40777270-10e2-4057-be5d-720ecf1e64e3	b7bba441-9314-4db4-ad48-5c7e81ff64a1	128	>=	2025-10-28 07:22:20.343131+00
bba3d2f4-efd7-4815-a7e5-ecd6600d0386	40777270-10e2-4057-be5d-720ecf1e64e3	34a7ee30-cc39-4263-b97e-40fb25d80852	5	>=	2025-10-28 07:22:20.343131+00
b4f8a5a1-307e-49d7-af0b-78449daba0e1	49e798b0-fec4-4ec6-b752-5cde1f6d5d01	565fc472-96a9-481e-96e9-cb6f06af78c1	45	<	2025-10-28 07:22:20.703959+00
4e090fcf-23fa-4723-8f61-44e8bb260d7c	49e798b0-fec4-4ec6-b752-5cde1f6d5d01	b7bba441-9314-4db4-ad48-5c7e81ff64a1	158	<=	2025-10-28 07:22:20.703959+00
be8f6e3a-2237-48df-9807-aaa0fef8f86b	c0a793ff-5e6e-4091-ba51-be60789d24e7	565fc472-96a9-481e-96e9-cb6f06af78c1	45	>	2025-10-28 07:22:52.165564+00
4c2c89ef-b8be-4450-aaa6-89e8e33d7d03	c0a793ff-5e6e-4091-ba51-be60789d24e7	b7bba441-9314-4db4-ad48-5c7e81ff64a1	68	>=	2025-10-28 07:22:52.165564+00
5988dd8d-a4cf-4caa-a473-fdb602336f8f	c0a793ff-5e6e-4091-ba51-be60789d24e7	34a7ee30-cc39-4263-b97e-40fb25d80852	34	=	2025-10-28 07:22:52.165564+00
15ab7f34-0c2d-4ed0-ba3f-af7b1133f53b	732a1e15-591b-4f0c-9178-5bc3868a2478	565fc472-96a9-481e-96e9-cb6f06af78c1	45	<	2025-10-28 07:22:52.54193+00
a3a34ad3-f2e6-401b-8cd2-ee39d145f14d	732a1e15-591b-4f0c-9178-5bc3868a2478	b7bba441-9314-4db4-ad48-5c7e81ff64a1	98	<=	2025-10-28 07:22:52.54193+00
091da522-a7bc-44d8-b7e6-123a044b6ebf	732a1e15-591b-4f0c-9178-5bc3868a2478	34a7ee30-cc39-4263-b97e-40fb25d80852	43	<=	2025-10-28 07:22:52.54193+00
8b2aa6c1-0e6d-4986-896b-2c8c170a2269	c60a31ca-f36a-4ef7-9d93-6ccc9cb06d1b	34a7ee30-cc39-4263-b97e-40fb25d80852	34	>	2025-10-28 07:22:52.900394+00
7ef4494c-9e54-4a3a-8b55-38ebd64adb18	b6bcbcae-185a-49a8-a509-02dd1652ac22	565fc472-96a9-481e-96e9-cb6f06af78c1	45	>	2025-10-28 07:22:53.264634+00
5144f33b-dd25-49bd-afe9-6a37baef87f8	b6bcbcae-185a-49a8-a509-02dd1652ac22	b7bba441-9314-4db4-ad48-5c7e81ff64a1	128	>=	2025-10-28 07:22:53.264634+00
231347b7-78aa-4783-901c-b4d8a6e7ec72	b6bcbcae-185a-49a8-a509-02dd1652ac22	34a7ee30-cc39-4263-b97e-40fb25d80852	5	>=	2025-10-28 07:22:53.264634+00
5ee97cac-d824-45a5-9ce5-654dd7b21ea5	06f863a8-b28f-4a0f-9323-f6a3e5af6bf9	565fc472-96a9-481e-96e9-cb6f06af78c1	45	<	2025-10-28 07:22:53.624008+00
48a15b8a-5797-463c-a9ca-adf54e2c244d	06f863a8-b28f-4a0f-9323-f6a3e5af6bf9	b7bba441-9314-4db4-ad48-5c7e81ff64a1	158	<=	2025-10-28 07:22:53.624008+00
\.


--
-- Data for Name: education_levels; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.education_levels (id, level_name, description, created_at) FROM stdin;
eeca1ed6-23c4-426f-a1e7-180bbf2a482c	master	\N	2025-10-23 13:28:31.575393+00
bcd5fdb8-97e3-4d80-8b6d-94a73da79216	bachelors	\N	2025-10-23 13:28:52.291307+00
2a6cf27a-5061-4736-8e66-43288e394ef0	phd	\N	2025-10-23 13:29:00.904703+00
3dbe2f70-7863-47e5-8912-0f375ef24f06	Diploma	Post-secondary diploma programs typically 1-3 years in duration	2025-10-24 06:22:50.414355+00
278be01b-5f00-47e1-8a76-ad3b71bfa824	Certificate	Short-term certification programs focused on specific skills	2025-10-24 06:22:50.414355+00
bde01205-9954-4c33-a40e-e7d5eedb34cc	Associate Degree	Two-year undergraduate degree program	2025-10-24 06:22:50.414355+00
818f4897-bf86-469f-a418-a742031565a2	High School	Secondary education completion	2025-10-24 06:22:50.414355+00
545405c0-5b36-4a65-bbc2-a09c09c4722e	Vocational Training	Skill-based professional training programs	2025-10-24 06:22:50.414355+00
7bc18bfa-52e0-4ae7-a0ae-cd8e612426d4	Advanced Diploma	Advanced post-secondary diploma programs	2025-10-24 06:22:50.414355+00
a8b8afff-d1a0-49a7-a52e-8a990f3113dc	Professional Certification	Industry-recognized professional certifications	2025-10-24 06:22:50.414355+00
07a8d81b-097d-4f3f-bc58-1466f30d3de8	Foundation Program	Preparatory program for higher education	2025-10-24 06:22:50.414355+00
\.


--
-- Data for Name: enquiries; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.enquiries (id, student_name, email, phone, overall_percentage, is_gap, gap_years, custom_fields, created_at, createdby) FROM stdin;
44f9ed5d-f7b6-4327-801b-07a7ff97d99d	parivesh 	rimjha.parivesh2002@gmail.com	9302998876	\N	f	0	"[{\\"field\\":\\"TG Score\\",\\"value\\":60}]"	2025-10-28 08:04:26.242506+00	\N
ae00fdf2-b612-4d3c-8e08-66cc30cfd2dd	parivesh 123	rimjha.parivesh2002@gmail.com	9302998876	\N	f	0	"[{\\"field\\":\\"TG Score\\",\\"value\\":60,\\"comparison\\":\\">\\"}]"	2025-10-28 10:07:07.909811+00	\N
3d90fe91-dc96-444a-96a8-61cb727e48df	parivesh 123456	user@example.com	9302998876	\N	f	0	"[{\\"field\\":\\"GT Score\\",\\"value\\":60,\\"comparison\\":\\">\\"}]"	2025-10-28 11:02:45.16435+00	\N
80c8cea2-321e-4978-bf49-179562457966	Abhi Patel 3	abhi@gmail.com1234	987652342234	\N	f	0	"[]"	2025-10-28 11:03:41.562731+00	\N
c7fcaede-7e77-40fc-a657-e063434bab78	Harsh sharma	harsh@gmail.com	987652342234	\N	f	0	"[]"	2025-10-28 11:29:49.951171+00	\N
ceb3fbbb-a68f-4daf-ab1a-892ea60868fa	Abhi Patel 5	abhi@gmail.com	91827251271	\N	f	0	"[]"	2025-10-28 13:07:47.123826+00	\N
c1d8716a-7425-476b-94f4-afb73e6de1b4	Abhi Patel 5	abhi@gmail.com	91827251271	\N	f	0	"[]"	2025-10-28 13:08:25.64798+00	\N
1819023e-f22b-43a2-a0a6-a789ea667fa7	Abhi Patel 5	abhi@gmail.com	91827251271	\N	f	0	"[]"	2025-10-28 13:08:30.355449+00	\N
645945e6-e814-46bc-a0a7-ca6544b0315d	parivesh789	admin@example.com	9302998876	\N	f	0	"[]"	2025-10-28 13:10:32.831152+00	\N
\.


--
-- Data for Name: enquiries_backup; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.enquiries_backup (id, student_name, email, phone, study_level, study_area, preferred_university, preferred_country, budget_range, ielts_score, toefl_score, pte_score, det_score, percentage, gre_score, gmat_score, sat_score, preferred_intake, additional_requirements, message, status, quried_by_user, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: interest_information; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.interest_information (id, enquiry_id, study_level, stream, pursue, course) FROM stdin;
\.


--
-- Data for Name: programs; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.programs (id, sr_no, university, university_ranking, study_level, study_area, programme_name, campus, duration, open_intake, open_call, application_deadline, entry_requirements, percentage_required, moi, ielts_score, ielts_no_band_less_than, toefl_score, toefl_no_band_less_than, pte_score, pte_no_band_less_than, det_score, det_no_band_less_than, tolc_score, sat_score, gre_score, gmat_score, cents_score, til_score, arched_test, application_fees, additional_requirements, remarks, created_at, updated_at) FROM stdin;
de6f895f-b83d-4a33-b883-1afca549e354	\N	University of Example	100	Bachelor	Computer Science	Computer Science	Main Campus	4 years	Fall 2024	Open	1970-01-01	High school diploma	80.00	English	6.5	6.0	90	20	65	60	120	100	25	1200	320	650	85	75	Pass	100.00	Portfolio required	Popular program	2025-10-28 06:56:56.485+00	2025-10-28 06:56:56.485+00
03e9b751-5f99-4cd0-945f-cd384ef27a8f	\N	University of Example	100	Bachelor	Computer Science	Computer Science	Main Campus	4 years	Fall 2024	Open	1970-01-01	High school diploma	80.00	English	6.5	6.0	90	20	65	60	120	100	25	1200	320	650	85	75	Pass	100.00	Portfolio required	Popular program	2025-10-28 06:56:56.485+00	2025-10-28 06:56:56.485+00
dbc4347b-c058-43c5-aaf9-0a76fff12693	\N	University of Example	100	Bachelor	Computer Science	Computer Science	Main Campus	4 years	Fall 2024	Open	1970-01-01	High school diploma	80.00	English	6.5	6.0	90	20	65	60	120	100	25	1200	320	650	85	75	Pass	100.00	Portfolio required	Popular program	2025-10-28 06:56:56.485+00	2025-10-28 06:56:56.485+00
faafa32d-3aac-408a-a4e0-5385b3a8b647	\N	Test UTD	11	Master		Th							\N		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N		\N			2025-10-24 11:45:50.191+00	2025-10-24 11:45:50.191+00
4366bcc0-0712-4ba3-91a3-c39fdba989b3	\N	University of Example	100	Bachelor	Computer Science	Computer Science	Main Campus	4 years	Fall 2024	Open	1970-01-01	High school diploma	80.00	English	6.5	6.0	90	20	65	60	120	100	25	1200	320	650	85	75	Pass	100.00	Portfolio required	Popular program	2025-10-28 06:56:56.485+00	2025-10-28 06:56:56.485+00
aa900125-4885-4907-87b1-3ab6ec31d5a0	\N	University of Example	100	Bachelor	Computer Science	Computer Science	Main Campus	4 years	Fall 2024	Open	1970-01-01	High school diploma	80.00	English	6.5	6.0	90	20	65	60	120	100	25	1200	320	650	85	75	Pass	100.00	Portfolio required	Popular program	2025-10-28 06:56:56.485+00	2025-10-28 06:56:56.485+00
3b794097-1919-4b0f-81aa-dd8db36be53f	\N	University of Example	100	Bachelor	Computer Science	Computer Science	Main Campus	4 years	Fall 2024	Open	1970-01-01	High school diploma	80.00	English	6.5	6.0	90	20	65	60	120	100	25	1200	320	650	85	75	Pass	100.00	Portfolio required	Popular program	2025-10-28 07:17:42.029+00	2025-10-28 07:17:42.029+00
dee95142-25a3-40bc-8c7c-abe17efd6a06	\N	University of Example	100	Bachelor	Computer Science	Computer Science	Main Campus	4 years	Fall 2024	Open	1970-01-01	High school diploma	80.00	English	6.5	6.0	90	20	65	60	120	100	25	1200	320	650	85	75	Pass	100.00	Portfolio required	Popular program	2025-10-28 07:17:42.029+00	2025-10-28 07:17:42.029+00
315bfdae-005d-48e2-919c-9ef5187652a1	\N	University of Example	100	Bachelor	Computer Science	Computer Science	Main Campus	4 years	Fall 2024	Open	1970-01-01	High school diploma	80.00	English	6.5	6.0	90	20	65	60	120	100	25	1200	320	650	85	75	Pass	100.00	Portfolio required	Popular program	2025-10-28 07:17:42.029+00	2025-10-28 07:17:42.029+00
479df2cd-469a-42de-9d9b-87bc1e8507c6	\N	University of Example	100	Bachelor	Computer Science	Computer Science	Main Campus	4 years	Fall 2024	Open	1970-01-01	High school diploma	80.00	English	6.5	6.0	90	20	65	60	120	100	25	1200	320	650	85	75	Pass	100.00	Portfolio required	Popular program	2025-10-28 07:17:42.029+00	2025-10-28 07:17:42.029+00
46912b8b-eb06-41af-aae5-ce32bb3917da	\N	University of Example	100	Bachelor	Computer Science	Computer Science	Main Campus	4 years	Fall 2024	Open	1970-01-01	High school diploma	80.00	English	6.5	6.0	90	20	65	60	120	100	25	1200	320	650	85	75	Pass	100.00	Portfolio required	Popular program	2025-10-28 07:17:42.029+00	2025-10-28 07:17:42.029+00
70e77fcd-20ef-4cac-adc7-668f4356bd74	\N	University of Example	100	Bachelor	Computer Science	Computer Science	Main Campus	4 years	Fall 2024	Open	1970-01-01	High school diploma	80.00	English	6.5	6.0	90	20	65	60	120	100	25	1200	320	650	85	75	Pass	100.00	Portfolio required	Popular program	2025-10-28 07:20:23.759+00	2025-10-28 07:20:23.759+00
5ccd6dfc-eb31-436f-b6fb-37f183304105	\N	University of Example	100	Bachelor	Computer Science	Computer Science	Main Campus	4 years	Fall 2024	Open	1970-01-01	High school diploma	80.00	English	6.5	6.0	90	20	65	60	120	100	25	1200	320	650	85	75	Pass	100.00	Portfolio required	Popular program	2025-10-28 07:20:23.759+00	2025-10-28 07:20:23.759+00
ad40595f-98f8-4720-8477-f5e60cb44ecb	\N	University of Example	100	Bachelor	Computer Science	Computer Science	Main Campus	4 years	Fall 2024	Open	1970-01-01	High school diploma	80.00	English	6.5	6.0	90	20	65	60	120	100	25	1200	320	650	85	75	Pass	100.00	Portfolio required	Popular program	2025-10-28 07:20:23.759+00	2025-10-28 07:20:23.759+00
47d0701f-af22-439e-88b0-b1de82d1b084	\N	mist	\N			sdfs							\N		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N		\N			2025-10-27 12:43:34.023+00	2025-10-27 12:43:34.023+00
fa2d7bd6-f8e8-41e0-9390-29c7d435dfea	\N	Abhibulk1	\N			sdfs							\N		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N		\N			2025-10-27 13:12:58.699+00	2025-10-27 13:12:58.699+00
b2a7a7a4-4ebd-4689-ac6a-8613f690c42e	\N	Abhibulk2	\N			sdfs smoef							\N		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N		\N			2025-10-27 13:12:58.699+00	2025-10-27 13:12:58.699+00
23e6348b-6925-4c15-a761-14a889905f9f	\N	University of Example	100	Bachelor	Computer Science	Computer Science	Main Campus	4 years	Fall 2024	Open	2024-03-15	High school diploma	80.00	English	6.5	6.0	90	20	65	60	120	100	25	1200	320	650	85	75	Pass	100.00	Portfolio required	Popular program	2025-10-27 13:54:27.843+00	2025-10-27 13:54:27.843+00
4f40a4bc-7e63-48a1-8a76-0838c6143186	\N	University of Example	100	Bachelor	Computer Science	Computer Science	Main Campus	4 years	Fall 2024	Open	2024-03-15	High school diploma	80.00	English	6.5	6.0	90	20	65	60	120	100	25	1200	320	650	85	75	Pass	100.00	Portfolio required	Popular program	2025-10-27 13:54:27.843+00	2025-10-27 13:54:27.843+00
c67cce3c-c76c-4e08-953d-de25a3630403	\N	University of Example	100	Bachelor	Computer Science	Computer Science	Main Campus	4 years	Fall 2024	Open	2024-03-15	High school diploma	80.00	English	6.5	6.0	90	20	65	60	120	100	25	1200	320	650	85	75	Pass	100.00	Portfolio required	Popular program	2025-10-27 13:54:27.843+00	2025-10-27 13:54:27.843+00
a3f28183-986f-4ff1-9e6c-200269e810d5	\N	University of Example	100	Bachelor	Computer Science	Computer Science	Main Campus	4 years	Fall 2024	Open	1970-01-01	High school diploma	80.00	English	6.5	6.0	90	20	65	60	120	100	25	1200	320	650	85	75	Pass	100.00	Portfolio required	Popular program	2025-10-28 07:20:23.759+00	2025-10-28 07:20:23.759+00
d0e7b189-6f51-4016-9e6c-ee59aefde3e8	\N	University of Example	100	Bachelor	Computer Science	Computer Science	Main Campus	4 years	Fall 2024	Open	1970-01-01	High school diploma	80.00	English	6.5	6.0	90	20	65	60	120	100	25	1200	320	650	85	75	Pass	100.00	Portfolio required	Popular program	2025-10-28 07:20:23.759+00	2025-10-28 07:20:23.759+00
df0d688b-7373-4194-96ab-14b933d458e4	\N	University of Example	100	Bachelor	Computer Science	Computer Science	Main Campus	4 years	Fall 2024	Open	1970-01-01	High school diploma	80.00	English	6.5	6.0	90	20	65	60	120	100	25	1200	320	650	85	75	Pass	100.00	Portfolio required	Popular program	2025-10-28 07:22:18.692+00	2025-10-28 07:22:18.692+00
d56421f0-7d30-4e71-8603-aa27b3f2d6d9	\N	University of Example	100	Bachelor	Computer Science	Computer Science	Main Campus	4 years	Fall 2024	Open	1970-01-01	High school diploma	80.00	English	6.5	6.0	90	20	65	60	120	100	25	1200	320	650	85	75	Pass	100.00	Portfolio required	Popular program	2025-10-28 07:22:18.692+00	2025-10-28 07:22:18.692+00
83dc16a5-ae02-4cdb-b617-867377aef5ce	\N	University of Example	100	Bachelor	Computer Science	Computer Science	Main Campus	4 years	Fall 2024	Open	1970-01-01	High school diploma	80.00	English	6.5	6.0	90	20	65	60	120	100	25	1200	320	650	85	75	Pass	100.00	Portfolio required	Popular program	2025-10-28 07:22:18.692+00	2025-10-28 07:22:18.692+00
40777270-10e2-4057-be5d-720ecf1e64e3	\N	University of Example	100	Bachelor	Computer Science	Computer Science	Main Campus	4 years	Fall 2024	Open	1970-01-01	High school diploma	80.00	English	6.5	6.0	90	20	65	60	120	100	25	1200	320	650	85	75	Pass	100.00	Portfolio required	Popular program	2025-10-28 07:22:18.692+00	2025-10-28 07:22:18.692+00
49e798b0-fec4-4ec6-b752-5cde1f6d5d01	\N	University of Example	100	Bachelor	Computer Science	Computer Science	Main Campus	4 years	Fall 2024	Open	1970-01-01	High school diploma	80.00	English	6.5	6.0	90	20	65	60	120	100	25	1200	320	650	85	75	Pass	100.00	Portfolio required	Popular program	2025-10-28 07:22:18.692+00	2025-10-28 07:22:18.692+00
c0a793ff-5e6e-4091-ba51-be60789d24e7	\N	University of Example	100	Bachelor	Computer Science	Computer Science	Main Campus	4 years	Fall 2024	Open	1970-01-01	High school diploma	80.00	English	6.5	6.0	90	20	65	60	120	100	25	1200	320	650	85	75	Pass	100.00	Portfolio required	Popular program	2025-10-28 07:22:51.598+00	2025-10-28 07:22:51.598+00
732a1e15-591b-4f0c-9178-5bc3868a2478	\N	University of Example	100	Bachelor	Computer Science	Computer Science	Main Campus	4 years	Fall 2024	Open	1970-01-01	High school diploma	80.00	English	6.5	6.0	90	20	65	60	120	100	25	1200	320	650	85	75	Pass	100.00	Portfolio required	Popular program	2025-10-28 07:22:51.598+00	2025-10-28 07:22:51.598+00
b6bcbcae-185a-49a8-a509-02dd1652ac22	\N	University of Example	100	Bachelor	Computer Science	Computer Science	Main Campus	4 years	Fall 2024	Open	1970-01-01	High school diploma	80.00	English	6.5	6.0	90	20	65	60	120	100	25	1200	320	650	85	75	Pass	100.00	Portfolio required	Popular program	2025-10-28 07:22:51.598+00	2025-10-28 07:22:51.598+00
06f863a8-b28f-4a0f-9323-f6a3e5af6bf9	\N	University of Example	100	Bachelor	Computer Science	Computer Science	Main Campus	4 years	Fall 2024	Open	1970-01-01	High school diploma	80.00	English	6.5	6.0	90	20	65	60	120	100	25	1200	320	650	85	75	Pass	100.00	Portfolio required	Popular program	2025-10-28 07:22:51.598+00	2025-10-28 07:22:51.598+00
c60a31ca-f36a-4ef7-9d93-6ccc9cb06d1b	\N	University of Example	100	Bachelor	Computer Science	Computer Science	Main Campus	4 years	Fall 2024	Open	1970-01-01	High school diploma	80.00	English	6.5	6.0	90	20	65	60	120	100	25	1200	320	650	85	75	Pass	100.00	Portfolio required	Popular program	2025-10-28 07:22:51.598+00	2025-10-28 07:22:51.598+00
\.


--
-- Data for Name: streams; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.streams (id, created_at, course, name, description) FROM stdin;
04faa7af-c757-4f9f-bd35-454d46929e16	2025-10-24 06:36:21.523291+00	643d8e23-2752-4ce7-a5aa-fb32111e04ca	Mechanical Engineering	Design, manufacturing, and maintenance of mechanical systems
3415f13a-8d92-40ee-84a2-dcd4e7b8254d	2025-10-24 06:36:21.523291+00	643d8e23-2752-4ce7-a5aa-fb32111e04ca	Civil Engineering	Construction, infrastructure, and structural engineering
074efe6e-794e-4b00-9611-7a2ef4dfdea5	2025-10-24 06:36:21.523291+00	643d8e23-2752-4ce7-a5aa-fb32111e04ca	Electrical Engineering	Electrical systems, power generation, and distribution
1aa13ee3-050d-46b1-ae07-3074e0b2d9da	2025-10-24 06:36:21.523291+00	643d8e23-2752-4ce7-a5aa-fb32111e04ca	Electronics and Communication Engineering	Electronic devices and communication systems
8bbb4491-da35-4c2f-a5d0-b2beafcbf20a	2025-10-24 06:36:21.523291+00	643d8e23-2752-4ce7-a5aa-fb32111e04ca	Automobile Engineering	Vehicle design, manufacturing, and maintenance
03175ecd-2ff2-4699-bd19-d3717a3f23cd	2025-10-24 06:36:21.523291+00	643d8e23-2752-4ce7-a5aa-fb32111e04ca	Chemical Engineering	Chemical processes and industrial chemistry
809f878b-3d61-4df9-a59c-9d702a74f455	2025-10-24 06:36:21.523291+00	643d8e23-2752-4ce7-a5aa-fb32111e04ca	Instrumentation Engineering	Measurement and control systems
4eec2f3f-0b61-4a84-97e1-d299a42df773	2025-10-24 06:36:21.523291+00	643d8e23-2752-4ce7-a5aa-fb32111e04ca	Production Engineering	Manufacturing processes and production management
8b56caec-b575-42ca-8fc2-ea276e3295a2	2025-10-24 06:41:33.679328+00	eebf3a71-6af8-478b-bdb3-68412481eaa9	Software Development	Programming and software application development
feb737f7-57de-4a38-9744-aca654359bf8	2025-10-24 06:41:33.679328+00	eebf3a71-6af8-478b-bdb3-68412481eaa9	Web Development	Web design and full-stack development
fb2f8e21-c907-4ad9-8321-677cb6aaa624	2025-10-24 06:41:33.679328+00	eebf3a71-6af8-478b-bdb3-68412481eaa9	Network Administration	Computer networks and system administration
5a3d08bc-4683-4b01-b64f-d34e371f3a26	2025-10-24 06:41:33.679328+00	eebf3a71-6af8-478b-bdb3-68412481eaa9	Database Management	Database design and administration
3a581dfc-ba25-4bc5-8e7d-f353cd2c0f04	2025-10-24 06:41:33.679328+00	eebf3a71-6af8-478b-bdb3-68412481eaa9	Mobile Application Development	iOS and Android app development
dd65f773-1bbe-49a6-8534-9b23743854a4	2025-10-24 06:41:33.679328+00	eebf3a71-6af8-478b-bdb3-68412481eaa9	Cyber Security	Information security and ethical hacking
9b05890e-c648-4dda-8b16-c98de484dfdf	2025-10-24 06:41:33.679328+00	c394bb77-5884-4ac4-a423-a9499e25fb8d	Marketing Management	Marketing strategies and brand management
75143e41-5d9a-4818-9fca-86b572391bc7	2025-10-24 06:41:33.679328+00	c394bb77-5884-4ac4-a423-a9499e25fb8d	Human Resource Management	HR practices and talent management
29c3a55a-9d45-42c9-85dd-75385bf8ae9b	2025-10-24 06:41:33.679328+00	c394bb77-5884-4ac4-a423-a9499e25fb8d	Financial Management	Financial planning and investment management
567b8801-d65a-4d09-87f0-10b186dddf42	2025-10-24 06:41:33.679328+00	c394bb77-5884-4ac4-a423-a9499e25fb8d	Operations Management	Business operations and supply chain
8f961197-9fe2-4e92-a93c-effb2688c5b7	2025-10-24 06:41:33.679328+00	c394bb77-5884-4ac4-a423-a9499e25fb8d	Retail Management	Retail operations and customer service
f59a34a5-e2ed-48c8-ad6f-060a70e84b3e	2025-10-24 06:41:33.679328+00	c394bb77-5884-4ac4-a423-a9499e25fb8d	International Business	Global business and trade management
e16f2519-5bd1-42b4-93d6-f6ba772d91c5	2025-10-24 06:41:33.679328+00	76d84a85-71a1-4a93-b2b8-7df9cd519a2e	Nursing	Patient care and clinical nursing
e18c99c4-f118-4ac2-be40-39923c431d8c	2025-10-24 06:41:33.679328+00	76d84a85-71a1-4a93-b2b8-7df9cd519a2e	Medical Laboratory Technology	Diagnostic testing and laboratory procedures
7337ee9a-32e8-4d9a-b09c-652f7eb9fb44	2025-10-24 06:41:33.679328+00	76d84a85-71a1-4a93-b2b8-7df9cd519a2e	Radiography	Medical imaging and radiology
455dcd08-1009-4302-8252-020bc1e623b6	2025-10-24 06:41:33.679328+00	76d84a85-71a1-4a93-b2b8-7df9cd519a2e	Physiotherapy	Physical therapy and rehabilitation
ea7bc7c5-712f-4cf2-a30f-d8f47b371c3b	2025-10-24 06:41:33.679328+00	76d84a85-71a1-4a93-b2b8-7df9cd519a2e	Dental Hygiene	Oral health and dental care
df6812e0-419c-418a-b001-f03cb27014e0	2025-10-24 06:41:33.679328+00	76d84a85-71a1-4a93-b2b8-7df9cd519a2e	Optometry	Vision care and eye health
9dd842c6-bf61-413c-88e0-89b500abad4f	2025-10-24 06:41:33.679328+00	81c99399-e74f-4e30-b90a-dc2d25369218	Hotel Management	Hotel operations and guest services
ca6910b2-58ba-4a84-9ec4-48ef9a4287ff	2025-10-24 06:41:33.679328+00	81c99399-e74f-4e30-b90a-dc2d25369218	Culinary Arts	Professional cooking and food preparation
65b10035-86f7-45a4-9b62-361d7ea2f7db	2025-10-24 06:41:33.679328+00	81c99399-e74f-4e30-b90a-dc2d25369218	Food and Beverage Service	Restaurant and catering management
a16f8bab-73a2-4d43-90b2-8059dfd56a6d	2025-10-24 06:41:33.679328+00	81c99399-e74f-4e30-b90a-dc2d25369218	Travel and Tourism	Tourism operations and travel planning
9c80e82e-2e02-4c58-92c3-d934e19910db	2025-10-24 06:41:33.679328+00	81c99399-e74f-4e30-b90a-dc2d25369218	Event Management	Event planning and coordination
5d5a5596-7b9d-4c9e-a2bb-f001b17b9002	2025-10-24 06:41:33.679328+00	81c99399-e74f-4e30-b90a-dc2d25369218	Bakery and Confectionery	Baking and pastry arts
c43c9a31-7748-4140-a1fe-960cdfa05146	2025-10-24 06:41:33.679328+00	ae65ebf7-b3fe-4e15-ae79-4ed0965b39b3	Graphic Design	Visual communication and digital design
30fd7f8b-f1d5-4646-827d-52f14b5c4b0f	2025-10-24 06:41:33.679328+00	ae65ebf7-b3fe-4e15-ae79-4ed0965b39b3	Interior Design	Space planning and interior decoration
c6932aa9-ddc8-4dbd-8f60-cf0b61856f76	2025-10-24 06:41:33.679328+00	ae65ebf7-b3fe-4e15-ae79-4ed0965b39b3	Fashion Design	Fashion illustration and garment design
563f32ac-48ab-405e-bf9d-2a8974413d8b	2025-10-24 06:41:33.679328+00	ae65ebf7-b3fe-4e15-ae79-4ed0965b39b3	Animation and VFX	Animation and visual effects
a7432fa7-38c3-4925-a3a7-223e202f2686	2025-10-24 06:41:33.679328+00	ae65ebf7-b3fe-4e15-ae79-4ed0965b39b3	Product Design	Industrial and product design
dcc61414-22d7-4047-89c1-34fabe097108	2025-10-24 06:41:33.679328+00	ae65ebf7-b3fe-4e15-ae79-4ed0965b39b3	Textile Design	Fabric and textile patterns
eb7261fc-5175-4441-9aef-96fcb6e30a04	2025-10-24 06:41:33.679328+00	b7d24f15-3b06-44a0-9cc0-f1a67ac6b866	Pharmaceutical Sciences	Drug formulation and pharmaceutical chemistry
177f78a2-cc53-46c6-80ae-11c19ebed41b	2025-10-24 06:41:33.679328+00	b7d24f15-3b06-44a0-9cc0-f1a67ac6b866	Clinical Pharmacy	Patient-focused pharmaceutical care
78b13e90-f7e2-4ac0-b5ac-ca2cee04d4e7	2025-10-24 06:41:33.679328+00	b7d24f15-3b06-44a0-9cc0-f1a67ac6b866	Hospital Pharmacy	Pharmacy services in healthcare settings
88f7308c-1a97-4713-83cc-2b08eb25cf3a	2025-10-24 06:41:33.679328+00	db1a5664-f902-4f95-8914-de6a9571cc30	Crop Production	Agricultural crop cultivation and management
51ae89af-cfa0-4bce-9828-af82dd6d2c6a	2025-10-24 06:41:33.679328+00	db1a5664-f902-4f95-8914-de6a9571cc30	Horticulture	Fruit, vegetable, and ornamental plant cultivation
f98ebb3b-f38e-4f7a-bfc3-5a6e04599e6d	2025-10-24 06:41:33.679328+00	db1a5664-f902-4f95-8914-de6a9571cc30	Agricultural Engineering	Farm machinery and agricultural technology
735fcaac-768d-4199-a14e-699682cb12ba	2025-10-24 06:41:33.679328+00	db1a5664-f902-4f95-8914-de6a9571cc30	Dairy Technology	Milk production and dairy management
fad34307-b642-4a67-ab83-327d1e3b25e9	2025-10-24 06:41:33.679328+00	254965c3-ea1c-4e6a-bd1c-f683d60a7e15	CompTIA A+	IT technical support fundamentals
dea076da-ee59-4e55-90dc-9323c9cbcaa1	2025-10-24 06:41:33.679328+00	254965c3-ea1c-4e6a-bd1c-f683d60a7e15	Cisco CCNA	Networking basics and configuration
12ebafe7-a47a-4dfd-9063-6ef7a3f365c1	2025-10-24 06:41:33.679328+00	254965c3-ea1c-4e6a-bd1c-f683d60a7e15	AWS Cloud Practitioner	Cloud computing fundamentals
66ad72a0-8972-4ec0-b370-3f714bd9acd1	2025-10-24 06:41:33.679328+00	254965c3-ea1c-4e6a-bd1c-f683d60a7e15	Microsoft Office Specialist	MS Office applications proficiency
84f07021-d217-46f1-8a8f-b129c3480bdf	2025-10-24 06:41:33.679328+00	254965c3-ea1c-4e6a-bd1c-f683d60a7e15	Python Programming	Python coding fundamentals
c5430215-3feb-423f-afc8-a35e63cabb0d	2025-10-24 06:41:33.679328+00	254965c3-ea1c-4e6a-bd1c-f683d60a7e15	Cybersecurity Essentials	Basic security concepts and practices
d9d42825-5088-49df-98b1-95f763f86263	2025-10-24 06:41:33.679328+00	5be5e8a1-991d-45ee-b6e1-5ebc30cafd56	Social Media Marketing	Social platform marketing strategies
40a94304-295c-415d-91c9-464894c78c14	2025-10-24 06:41:33.679328+00	5be5e8a1-991d-45ee-b6e1-5ebc30cafd56	Search Engine Optimization	SEO techniques and optimization
3d628772-d864-4bc8-a56d-ff8f743f39a9	2025-10-24 06:41:33.679328+00	5be5e8a1-991d-45ee-b6e1-5ebc30cafd56	Google Ads	Pay-per-click advertising
eadba878-af70-419c-9276-1cea74ad3bfe	2025-10-24 06:41:33.679328+00	5be5e8a1-991d-45ee-b6e1-5ebc30cafd56	Content Marketing	Content creation and strategy
c5df1b41-78aa-4194-a88f-516c23ed42f4	2025-10-24 06:41:33.679328+00	5be5e8a1-991d-45ee-b6e1-5ebc30cafd56	Email Marketing	Email campaign management
8e5d0cd6-af00-47b7-bc0d-34b786a1ebee	2025-10-24 06:41:33.679328+00	2ec4cf15-be36-4149-a518-34652ee568cc	English Language	English proficiency and communication
ace28dcd-b5da-440c-a67f-9d091f4d75b5	2025-10-24 06:41:33.679328+00	2ec4cf15-be36-4149-a518-34652ee568cc	Spanish Language	Spanish speaking and writing
cb6dac53-6240-4a5e-8789-4b5a49940122	2025-10-24 06:41:33.679328+00	2ec4cf15-be36-4149-a518-34652ee568cc	French Language	French language fundamentals
8ccb8711-6967-40c5-92fd-cac8c9055dba	2025-10-24 06:41:33.679328+00	2ec4cf15-be36-4149-a518-34652ee568cc	German Language	German language basics
a8a3b228-879e-472a-a046-64d8f4d7ac63	2025-10-24 06:41:33.679328+00	2ec4cf15-be36-4149-a518-34652ee568cc	Mandarin Chinese	Chinese language and culture
989c8003-2799-4e3d-8652-de872bebc0c9	2025-10-24 06:41:33.679328+00	2ec4cf15-be36-4149-a518-34652ee568cc	Business Communication	Professional communication skills
e18d6140-590d-4cfc-8cd3-61a9cdeed8f0	2025-10-24 06:41:33.679328+00	be709011-f1b4-48f0-b2f5-f6cad24b5c6a	Electrical Work	Electrical installation and repair
785825aa-864d-4eaf-a80c-0c6171d7fd16	2025-10-24 06:41:33.679328+00	be709011-f1b4-48f0-b2f5-f6cad24b5c6a	Plumbing	Plumbing systems and maintenance
73cd70c8-df55-4c7c-921d-0bc8723979c4	2025-10-24 06:41:33.679328+00	be709011-f1b4-48f0-b2f5-f6cad24b5c6a	Carpentry	Woodworking and furniture making
fe8d49ae-cc4a-4a47-b794-3b769e915b0f	2025-10-24 06:41:33.679328+00	be709011-f1b4-48f0-b2f5-f6cad24b5c6a	Welding	Welding techniques and safety
00678d4e-5efa-4e6f-a864-2cd6ccde0738	2025-10-24 06:41:33.679328+00	be709011-f1b4-48f0-b2f5-f6cad24b5c6a	Auto Mechanics	Vehicle repair and maintenance
c2eefccc-f6be-4055-a4a6-bf24702aa333	2025-10-24 06:41:33.679328+00	be709011-f1b4-48f0-b2f5-f6cad24b5c6a	HVAC Systems	Heating and cooling systems
3730c83d-e64b-43f3-ba02-126c8c3bec57	2025-10-24 06:41:33.679328+00	98bd3a3b-5dd0-4e7d-8986-0e3ee4e3b0cd	Project Management	Project planning and execution
4bb946e1-cc4b-4ddf-9129-83f1f4455cf4	2025-10-24 06:41:33.679328+00	98bd3a3b-5dd0-4e7d-8986-0e3ee4e3b0cd	Bookkeeping	Basic accounting and financial records
2c748d86-daee-4991-9962-3a5ef064a14f	2025-10-24 06:41:33.679328+00	98bd3a3b-5dd0-4e7d-8986-0e3ee4e3b0cd	Customer Service	Customer relations and support
fedab5e0-eb1f-46f8-973f-0c15775da68d	2025-10-24 06:41:33.679328+00	98bd3a3b-5dd0-4e7d-8986-0e3ee4e3b0cd	Leadership Skills	Team leadership and management
a6c57ce0-9773-4353-bbfa-e518fd0220fb	2025-10-24 06:41:33.679328+00	98bd3a3b-5dd0-4e7d-8986-0e3ee4e3b0cd	Business Analytics	Data analysis for business decisions
e8a8ff70-391e-4224-bd18-1fcbb9504d20	2025-10-24 06:41:33.679328+00	3d9f00b0-1024-41c8-aebd-7754d1e9ed2f	Photography	Digital photography techniques
7f709333-3749-4277-94be-437da5d32273	2025-10-24 06:41:33.679328+00	3d9f00b0-1024-41c8-aebd-7754d1e9ed2f	Video Editing	Video production and editing
d176c094-f4eb-42e7-ab89-fbb322aa0c10	2025-10-24 06:41:33.679328+00	3d9f00b0-1024-41c8-aebd-7754d1e9ed2f	Music Production	Audio recording and music creation
5957a554-1f58-4f96-b136-4e6d67c3f91e	2025-10-24 06:41:33.679328+00	3d9f00b0-1024-41c8-aebd-7754d1e9ed2f	Drawing and Painting	Fine arts fundamentals
6125db9c-098b-43f3-920e-5332e7739867	2025-10-24 06:41:33.679328+00	3d9f00b0-1024-41c8-aebd-7754d1e9ed2f	Creative Writing	Writing techniques and storytelling
87c84102-8a46-43ab-9b05-16604de64a2c	2025-10-24 06:41:33.679328+00	6b3ef90e-555a-41bb-ac81-e8c08dcb5ea3	Occupational Health and Safety	Workplace safety management
3c3e3f39-0cf7-48a1-b1b2-dd7d7a21f5aa	2025-10-24 06:41:33.679328+00	6b3ef90e-555a-41bb-ac81-e8c08dcb5ea3	First Aid and CPR	Emergency medical response
00281802-cdd2-4276-8b97-32748ebd0503	2025-10-24 06:41:33.679328+00	6b3ef90e-555a-41bb-ac81-e8c08dcb5ea3	Fire Safety	Fire prevention and emergency response
1a8f023e-fa31-4fa4-b762-4fec90d30d64	2025-10-24 06:41:33.679328+00	6b3ef90e-555a-41bb-ac81-e8c08dcb5ea3	Food Safety	Food handling and hygiene standards
214e3e44-44d6-4ec7-9167-284ffc48d864	2025-10-24 06:41:33.679328+00	e8c59e2d-6eac-415f-950b-6fe2af1e92df	Psychology	Introduction to psychological sciences
bfe51d63-3840-4bd2-82b3-72fe3e3f574a	2025-10-24 06:41:33.679328+00	e8c59e2d-6eac-415f-950b-6fe2af1e92df	Communications	Media and communication studies
51cae824-24e6-41db-bf85-a17f91b725b3	2025-10-24 06:41:33.679328+00	e8c59e2d-6eac-415f-950b-6fe2af1e92df	English Literature	Literature analysis and composition
38c3dfc5-8b58-4092-8039-4760a20b4abe	2025-10-24 06:41:33.679328+00	e8c59e2d-6eac-415f-950b-6fe2af1e92df	History	Historical studies and research
40c3092a-06c8-446d-ac47-7b1725cfc455	2025-10-24 06:41:33.679328+00	e8c59e2d-6eac-415f-950b-6fe2af1e92df	Sociology	Social behavior and society
eb1f268a-f0f7-49ce-b209-16219e40cb4b	2025-10-24 06:41:33.679328+00	e8c59e2d-6eac-415f-950b-6fe2af1e92df	Philosophy	Philosophical thought and reasoning
af2272cc-9a2e-4f10-abc3-91037e1d6014	2025-10-24 06:41:33.679328+00	9e95f38b-4454-4b5b-bce3-db09c24793e8	Biology	Biological sciences fundamentals
f82f0565-15d7-4a2d-b7bf-4cc10484735b	2025-10-24 06:41:33.679328+00	9e95f38b-4454-4b5b-bce3-db09c24793e8	Chemistry	Chemical sciences and laboratory work
1b1f5e0d-7ae2-48bd-9e03-ffcac9a19847	2025-10-24 06:41:33.679328+00	9e95f38b-4454-4b5b-bce3-db09c24793e8	Mathematics	Mathematical theory and applications
cc35e08e-019f-4d02-8b82-195bdef67fc2	2025-10-24 06:41:33.679328+00	9e95f38b-4454-4b5b-bce3-db09c24793e8	Physics	Physical sciences and mechanics
f8701736-8308-4719-b113-951dc19ba666	2025-10-24 06:41:33.679328+00	9e95f38b-4454-4b5b-bce3-db09c24793e8	Environmental Science	Environmental systems and ecology
2dac4ac8-731c-45f9-940e-ba76f40bba4b	2025-10-24 06:41:33.679328+00	9e95f38b-4454-4b5b-bce3-db09c24793e8	Computer Science	Programming and computational thinking
59680484-4887-4815-9c87-2fc63392244a	2025-10-24 06:41:33.679328+00	fc6cb00c-9d97-4bd9-9d3f-c5d050b5af40	Information Technology	IT systems and support
fafad66e-63f5-4376-a704-a3b2a539f1dd	2025-10-24 06:41:33.679328+00	fc6cb00c-9d97-4bd9-9d3f-c5d050b5af40	Cybersecurity	Network security and protection
58d3cb07-9c76-430f-b4ff-a692d8f4d213	2025-10-24 06:41:33.679328+00	fc6cb00c-9d97-4bd9-9d3f-c5d050b5af40	Engineering Technology	Applied engineering principles
7b6ed9df-a4a7-42c4-8356-9c21396106e8	2025-10-24 06:41:33.679328+00	fc6cb00c-9d97-4bd9-9d3f-c5d050b5af40	Nursing	Registered nursing preparation
347718f1-988a-4dff-be93-fc86f3aa2652	2025-10-24 06:41:33.679328+00	fc6cb00c-9d97-4bd9-9d3f-c5d050b5af40	Graphic Design	Visual design and media
b72323a6-bb69-455e-8a50-cff8c045c33d	2025-10-24 06:41:33.679328+00	fc6cb00c-9d97-4bd9-9d3f-c5d050b5af40	Culinary Arts	Professional cooking techniques
8bb5a2ec-f9e6-4d8b-934c-ef67b229c436	2025-10-24 06:41:33.679328+00	14e0ecfc-72ab-4031-9e96-89736c436156	Business Administration	General business management
eafd9d3c-c510-4c53-8ac0-86f373fcf974	2025-10-24 06:41:33.679328+00	14e0ecfc-72ab-4031-9e96-89736c436156	Accounting	Financial accounting principles
dd5f3289-2bda-45a1-8171-783bc767f239	2025-10-24 06:41:33.679328+00	14e0ecfc-72ab-4031-9e96-89736c436156	Marketing	Marketing principles and consumer behavior
4be357f9-0f21-4c4f-a94e-cb7029368780	2025-10-24 06:41:33.679328+00	14e0ecfc-72ab-4031-9e96-89736c436156	Economics	Microeconomics and macroeconomics
66f89ea8-c6f6-40de-b566-75c23d12aef0	2025-10-24 06:41:33.679328+00	14e0ecfc-72ab-4031-9e96-89736c436156	Finance	Financial management and investments
7876df50-6d05-4c40-8ae4-1db3ad91e257	2025-10-24 06:41:33.679328+00	14e0ecfc-72ab-4031-9e96-89736c436156	Entrepreneurship	Starting and managing businesses
bfbe041a-de21-4e35-a08d-9d39122a4480	2025-10-24 06:41:33.679328+00	593a4a4a-4c83-4845-aa32-6193e0620d7e	Auto Mechanics	Vehicle diagnosis and repair
78c263ea-2591-473d-80c4-bffb75664e24	2025-10-24 06:41:33.679328+00	593a4a4a-4c83-4845-aa32-6193e0620d7e	Auto Body Repair	Body work and painting
7fd8ddff-6987-4052-bf8b-dcc345ad1041	2025-10-24 06:41:33.679328+00	593a4a4a-4c83-4845-aa32-6193e0620d7e	Diesel Mechanics	Diesel engine repair and maintenance
03910aa0-4b18-418e-807b-76ce8f70ce56	2025-10-24 06:41:33.679328+00	593a4a4a-4c83-4845-aa32-6193e0620d7e	Motorcycle Mechanics	Two-wheeler repair and service
c4c3b16e-6b39-4845-9415-bdfbd3023a28	2025-10-24 06:41:33.679328+00	8b457b92-c402-4355-ad9d-2d4f180fa7b7	Cosmetology	Hair styling and beauty treatments
35f90779-5aed-46ad-9c68-dfcf5aaec984	2025-10-24 06:41:33.679328+00	8b457b92-c402-4355-ad9d-2d4f180fa7b7	Makeup Artistry	Professional makeup application
6c665404-55c2-484b-9f38-a7fd5f932c23	2025-10-24 06:41:33.679328+00	8b457b92-c402-4355-ad9d-2d4f180fa7b7	Nail Technology	Manicure and nail art
6453a935-7347-4ebb-9854-f7e6868dffd9	2025-10-24 06:41:33.679328+00	8b457b92-c402-4355-ad9d-2d4f180fa7b7	Spa Therapy	Spa treatments and wellness
8d5e8e0f-fad8-4a98-bde8-8e980f820ef1	2025-10-24 06:41:33.679328+00	8b457b92-c402-4355-ad9d-2d4f180fa7b7	Massage Therapy	Therapeutic massage techniques
b9dda26c-1948-4895-bf35-74c5c33d7038	2025-10-24 06:41:33.679328+00	26d7ddaa-26f5-47a5-81cb-91602d2e410f	Masonry	Brick and stone laying
b53a8517-69ca-462f-a495-00d0b331c0eb	2025-10-24 06:41:33.679328+00	26d7ddaa-26f5-47a5-81cb-91602d2e410f	Heavy Equipment Operation	Operating construction machinery
f48667bd-0a5c-4fd8-b10a-7e9a71c90ed1	2025-10-24 06:41:33.679328+00	26d7ddaa-26f5-47a5-81cb-91602d2e410f	Painting and Decorating	Surface finishing and decoration
5cefd48e-c889-4031-a9e6-72e718a0dac8	2025-10-24 06:41:33.679328+00	26d7ddaa-26f5-47a5-81cb-91602d2e410f	Roofing	Roof installation and repair
5f47cafc-a027-48fc-b4f2-f37b759b1b7f	2025-10-24 06:41:33.679328+00	26d7ddaa-26f5-47a5-81cb-91602d2e410f	Tile Setting	Tile installation and finishing
0fcfffa8-e020-48ec-97fa-f27fde02f15d	2025-10-24 06:41:33.679328+00	b99ca97d-9321-480b-beb6-03a95e27b3e1	CNC Machining	Computer-controlled machining
9cf92666-cb46-46cd-b2eb-8fcf3837c2de	2025-10-24 06:41:33.679328+00	b99ca97d-9321-480b-beb6-03a95e27b3e1	Industrial Maintenance	Equipment maintenance and troubleshooting
6fe1aab9-9ab2-4065-8e4d-b377587e024a	2025-10-24 06:41:33.679328+00	b99ca97d-9321-480b-beb6-03a95e27b3e1	Quality Control	Product inspection and quality assurance
abe0b3e9-86af-4a29-99f9-f3270c6f05a2	2025-10-24 06:41:33.679328+00	b99ca97d-9321-480b-beb6-03a95e27b3e1	Assembly Line Operations	Manufacturing assembly processes
8bc6f463-919c-4f35-89de-d06f681bcf09	2025-10-24 06:41:33.679328+00	f4fcf9a4-a0fc-48d3-8860-e7e706c18df3	Professional Cooking	Culinary techniques and kitchen management
a81960db-32a3-430e-bc40-6edb6d80b3f6	2025-10-24 06:41:33.679328+00	f4fcf9a4-a0fc-48d3-8860-e7e706c18df3	Baking and Pastry	Bread and dessert preparation
d7b5297a-b869-43ae-98b2-924a1343cebe	2025-10-24 06:41:33.679328+00	f4fcf9a4-a0fc-48d3-8860-e7e706c18df3	Food Service Management	Restaurant operations and service
db2cd82d-a364-4165-89d9-8fbe644c6f92	2025-10-24 06:41:33.679328+00	f4fcf9a4-a0fc-48d3-8860-e7e706c18df3	Catering Services	Event catering and food preparation
5dec7bd6-9ded-4f6e-b3d6-27e456b0067b	2025-10-24 06:41:33.679328+00	0b684939-ab1c-49a3-b06d-4f38fb0d3882	Sales Techniques	Customer engagement and sales
be7a72f1-e6a6-485a-890d-03de6af231a8	2025-10-24 06:41:33.679328+00	0b684939-ab1c-49a3-b06d-4f38fb0d3882	Store Operations	Retail management and inventory
e062d333-1838-4cf7-ab72-faedf2d1577a	2025-10-24 06:41:33.679328+00	0b684939-ab1c-49a3-b06d-4f38fb0d3882	Visual Merchandising	Product display and store layout
fe8b48e2-6f51-4c92-9303-a4a03e19be02	2025-10-24 06:41:33.679328+00	0b684939-ab1c-49a3-b06d-4f38fb0d3882	Cashier Operations	Point-of-sale systems and transactions
1acf046e-cba2-4753-82b6-c1fb602fa5bf	2025-10-24 06:41:33.679328+00	261b7232-dbb5-4281-bf60-e83742546486	Mechatronics	Integration of mechanical and electronic systems
44ca0502-7e3f-4d6d-9044-5b24e2fecf75	2025-10-24 06:41:33.679328+00	261b7232-dbb5-4281-bf60-e83742546486	Robotics	Robot design and automation
ed52673c-e51d-4fc1-9f7b-b9421a24be15	2025-10-24 06:41:33.679328+00	261b7232-dbb5-4281-bf60-e83742546486	Renewable Energy	Sustainable energy systems
399da420-ba50-48dc-99f4-c33cd353cdb9	2025-10-24 06:41:33.679328+00	261b7232-dbb5-4281-bf60-e83742546486	CAD/CAM Technology	Computer-aided design and manufacturing
0c2f8c16-a407-45e9-99f5-f610b10551ca	2025-10-24 06:41:33.679328+00	1b9e7e3a-5de9-407d-ab2b-dba61da85b0c	Strategic Management	Business strategy and planning
3c1db94c-3078-4999-b1ac-327626f14073	2025-10-24 06:41:33.679328+00	1b9e7e3a-5de9-407d-ab2b-dba61da85b0c	Supply Chain Management	Logistics and supply chain optimization
533d5d01-d1c7-4029-bde0-a7ffb69dd027	2025-10-24 06:41:33.679328+00	1b9e7e3a-5de9-407d-ab2b-dba61da85b0c	Quality Management	Quality systems and continuous improvement
c0ef4dce-6f4b-4e0f-bfbf-fb8a8b4ae5fd	2025-10-24 06:41:33.679328+00	1b9e7e3a-5de9-407d-ab2b-dba61da85b0c	Risk Management	Business risk assessment and mitigation
da12bcb5-24a5-46c9-ac42-b81d4a18e88b	2025-10-24 06:41:33.679328+00	7a402bdf-1b5c-4184-ac25-70e00aa066e0	Cloud Computing	Cloud architecture and services
6e59a1d2-801f-4b51-9b43-c1e144b81905	2025-10-24 06:41:33.679328+00	7a402bdf-1b5c-4184-ac25-70e00aa066e0	Data Science	Big data analytics and machine learning
95335eab-3edb-487e-ab90-13d02668c93c	2025-10-24 06:41:33.679328+00	7a402bdf-1b5c-4184-ac25-70e00aa066e0	DevOps	Development and operations integration
551bba92-b470-4972-b91f-f8cee9162c2c	2025-10-24 06:41:33.679328+00	7a402bdf-1b5c-4184-ac25-70e00aa066e0	Blockchain Technology	Distributed ledger systems
644d8a85-b6c0-4d19-b02b-7bc7a44547e1	2025-10-24 06:41:33.679328+00	cc0f366a-a21c-4371-909d-c99c623d2d57	Critical Care Nursing	Intensive care and emergency nursing
53cc0252-7f55-4bb5-8182-c01d0d7c8f12	2025-10-24 06:41:33.679328+00	cc0f366a-a21c-4371-909d-c99c623d2d57	Medical Imaging Technology	Advanced diagnostic imaging
71441019-1ad5-4d34-a8b1-c27d4a9b6b96	2025-10-24 06:41:33.679328+00	cc0f366a-a21c-4371-909d-c99c623d2d57	Cardiac Technology	Cardiovascular diagnostics
e764943b-a958-4d49-92c0-825a43ad65d0	2025-10-24 06:41:33.679328+00	cc0f366a-a21c-4371-909d-c99c623d2d57	Anesthesia Technology	Anesthesia administration and monitoring
03c76263-864b-4df3-a640-9c31fcb44e55	2025-10-24 06:41:33.679328+00	ac84a9f8-d225-47ef-9dfb-3d92bb088f0c	CISSP	Certified Information Systems Security Professional
1dd24240-b460-44fd-a4a5-f33fd487ded7	2025-10-24 06:41:33.679328+00	ac84a9f8-d225-47ef-9dfb-3d92bb088f0c	AWS Solutions Architect	Amazon Web Services architecture certification
c1847ab6-778a-4f32-a382-2df9aa78d0de	2025-10-24 06:41:33.679328+00	ac84a9f8-d225-47ef-9dfb-3d92bb088f0c	Microsoft Azure Administrator	Azure cloud administration
30c51a32-e76f-4132-8ebd-d2765bc84f08	2025-10-24 06:41:33.679328+00	ac84a9f8-d225-47ef-9dfb-3d92bb088f0c	Google Cloud Professional	Google Cloud Platform expertise
46014abc-0510-484a-9d88-8105ad256a2e	2025-10-24 06:41:33.679328+00	fe14cdd2-3d7d-4f04-a367-bacc14b76036	CFA (Chartered Financial Analyst)	Investment and financial analysis
ef43bf4f-3954-4044-ad3e-0d2a38f85462	2025-10-24 06:41:33.679328+00	fe14cdd2-3d7d-4f04-a367-bacc14b76036	CPA (Certified Public Accountant)	Accounting and auditing certification
518d305a-ef7f-4c08-9116-7d79fa263b6d	2025-10-24 06:41:33.679328+00	fe14cdd2-3d7d-4f04-a367-bacc14b76036	FRM (Financial Risk Manager)	Financial risk management
3d54f83d-e378-45e0-b69f-28d552d4c826	2025-10-24 06:41:33.679328+00	fe14cdd2-3d7d-4f04-a367-bacc14b76036	CFP (Certified Financial Planner)	Financial planning and wealth management
9476da7d-93c1-44c4-ad3e-9a60e28a3b1c	2025-10-24 06:41:33.679328+00	9a012e3f-b64a-42ec-8c73-2e636653f814	PMP (Project Management Professional)	Advanced project management certification
4933ce24-160c-4130-97eb-3c42fc01e43f	2025-10-24 06:41:33.679328+00	9a012e3f-b64a-42ec-8c73-2e636653f814	PRINCE2	Project management methodology
9c720689-01b6-490b-8c57-c9efe5ca932a	2025-10-24 06:41:33.679328+00	9a012e3f-b64a-42ec-8c73-2e636653f814	Agile Scrum Master	Agile project management
e94cc38d-ed3e-49c6-8392-474e125cb0f3	2025-10-24 06:41:33.679328+00	9a012e3f-b64a-42ec-8c73-2e636653f814	Six Sigma Black Belt	Process improvement and quality management
c0882c95-842d-44cb-aa68-4dc9fc62f4c7	2025-10-24 06:41:33.679328+00	efe5ee77-77c8-449f-b0bb-4eeaa05a0f92	SHRM-CP	Society for Human Resource Management Certified Professional
22ff25fe-944f-4a5a-a428-968696001caf	2025-10-24 06:41:33.679328+00	efe5ee77-77c8-449f-b0bb-4eeaa05a0f92	PHR (Professional in Human Resources)	HR management certification
af7c82e4-6274-4380-acd8-b93f37ec766f	2025-10-24 06:41:33.679328+00	efe5ee77-77c8-449f-b0bb-4eeaa05a0f92	CHRP	Certified Human Resources Professional
8c758deb-9b8e-4f03-8aa4-52adcb324184	2025-10-24 06:41:33.679328+00	efe5ee77-77c8-449f-b0bb-4eeaa05a0f92	Talent Management Specialist	Recruitment and talent development
7e9285df-31af-40ed-8e85-81b4a177f30c	2025-10-24 06:41:33.679328+00	436dde1e-29a3-4076-bec5-91dfd5fc7a40	Mathematics and Physics	Core math and physics fundamentals
e26f7846-304e-420c-8217-a0615d1f1da1	2025-10-24 06:41:33.679328+00	436dde1e-29a3-4076-bec5-91dfd5fc7a40	Computer Fundamentals	Basic computing and programming
6d60bd67-1e12-43ec-99d8-bcfb79d75d38	2025-10-24 06:41:33.679328+00	436dde1e-29a3-4076-bec5-91dfd5fc7a40	Engineering Drawing	Technical drawing and CAD basics
b8c4dcec-ca5c-46d6-ab18-e44db081d032	2025-10-24 06:41:33.679328+00	436dde1e-29a3-4076-bec5-91dfd5fc7a40	Applied Sciences	Chemistry and material science basics
fea5f401-b3fe-459e-95ec-3f05c0e8dda1	2025-10-24 06:41:33.679328+00	c7ebd13c-56ec-4dc9-b70a-abf4e0b90926	Business Mathematics	Quantitative methods for business
387c5eb2-bc24-4705-9975-f589f2637ac2	2025-10-24 06:41:33.679328+00	c7ebd13c-56ec-4dc9-b70a-abf4e0b90926	Introduction to Economics	Basic economic principles
6c9393ac-1d57-4d9c-becc-1cba97d89ac3	2025-10-24 06:41:33.679328+00	c7ebd13c-56ec-4dc9-b70a-abf4e0b90926	Business Communication	Professional writing and presentation
e8b58faa-5d5a-47f0-a0bc-024ff43caaf0	2025-10-24 06:41:33.679328+00	c7ebd13c-56ec-4dc9-b70a-abf4e0b90926	Accounting Fundamentals	Basic accounting principles
541a89df-8ac6-4522-b51b-f2e51ba46eb4	2025-10-24 06:41:33.679328+00	e55d7f4a-111c-4678-b237-12599b86f157	General Biology	Life sciences fundamentals
79cd64a5-6861-4fd9-907c-20c8efa6e5b7	2025-10-24 06:41:33.679328+00	e55d7f4a-111c-4678-b237-12599b86f157	General Chemistry	Chemical principles and reactions
390ea447-6f41-47d5-ae76-0f1a7806b5d5	2025-10-24 06:41:33.679328+00	e55d7f4a-111c-4678-b237-12599b86f157	General Physics	Physics concepts and applications
e84c6df6-affa-4714-ad67-13b9ccb97f78	2025-10-24 06:41:33.679328+00	e55d7f4a-111c-4678-b237-12599b86f157	Statistics and Data Analysis	Statistical methods for science
3df6f6c8-c9c7-4660-b16e-74b78772849e	2025-10-24 06:41:33.679328+00	650b3085-e126-4a01-965c-552d3f31a926	English Language and Literature	English proficiency and literary studies
d0c01c10-af4b-422c-b8e6-4363e86005b3	2025-10-24 06:41:33.679328+00	650b3085-e126-4a01-965c-552d3f31a926	Social Sciences	Introduction to sociology and psychology
976d34ca-7388-4270-9085-3325d26fa03f	2025-10-24 06:41:33.679328+00	650b3085-e126-4a01-965c-552d3f31a926	Critical Thinking and Writing	Analytical and writing skills
e15dd3fe-47d2-4e31-b3c3-105a5946c9fc	2025-10-24 06:41:33.679328+00	650b3085-e126-4a01-965c-552d3f31a926	World History and Culture	Global historical perspectives
fbfcb98e-b457-4f11-b16e-cfdb1e7fae71	2025-10-24 06:41:33.679328+00	7cc5da9f-695d-42b8-b943-6137d0517c49	General Studies	Comprehensive core curriculum
9a7a9f6d-248d-4d02-ba9f-f339876e538c	2025-10-24 06:41:33.679328+00	7cc5da9f-695d-42b8-b943-6137d0517c49	College Preparatory	Advanced placement and honors courses
e0aa2068-1660-45ad-9892-df4eed86ed04	2025-10-24 06:41:33.679328+00	7cc5da9f-695d-42b8-b943-6137d0517c49	International Baccalaureate (IB)	Internationally recognized curriculum
5bfdbd53-7930-40e2-ba52-66d749af06b1	2025-10-24 06:41:33.679328+00	7cc5da9f-695d-42b8-b943-6137d0517c49	STEM Focus	Science, technology, engineering, and math emphasis
8dc03b1f-46f0-4061-8f8b-3d9afa01bf41	2025-10-24 06:41:33.679328+00	1fd1149c-f01e-4bdc-baa9-587f803d847b	Physics, Chemistry, Mathematics	PCM combination for engineering
80a5c487-332b-4ae4-bce2-ea279da19525	2025-10-24 06:41:33.679328+00	1fd1149c-f01e-4bdc-baa9-587f803d847b	Physics, Chemistry, Biology	PCB combination for medical studies
8f6908a2-e521-42a9-b75b-96afc432b536	2025-10-24 06:41:33.679328+00	1fd1149c-f01e-4bdc-baa9-587f803d847b	Biology, Chemistry, Mathematics	BCM combination for biotechnology
976cb637-e4a1-457c-ab0b-d819f2bce74b	2025-10-24 06:41:33.679328+00	1fd1149c-f01e-4bdc-baa9-587f803d847b	Computer Science, Physics, Mathematics	Computer science focused track
ffd5ff82-d8b3-465d-b15a-db8989428f76	2025-10-24 06:41:33.679328+00	3a720b3b-3776-48fb-8348-ba6e73b0dc22	Accounting, Business Studies, Economics	Core commerce subjects
b6d9f311-753c-4bd6-9b5f-73755dfac6e2	2025-10-24 06:41:33.679328+00	3a720b3b-3776-48fb-8348-ba6e73b0dc22	Commerce with Mathematics	Quantitative commerce focus
f9e4362c-be25-42a0-91bb-899fde4657a6	2025-10-24 06:41:33.679328+00	3a720b3b-3776-48fb-8348-ba6e73b0dc22	Entrepreneurship Studies	Business and startup focus
09ecfc87-4e5a-45c8-837b-f7f8f9e76789	2025-10-24 06:41:33.679328+00	3a720b3b-3776-48fb-8348-ba6e73b0dc22	Finance and Banking	Financial services focus
0001edc5-e920-4cda-a535-2e30039ef2d4	2025-10-24 06:41:33.679328+00	65a81640-ba85-49cd-af0a-5564f2233738	Humanities	History, geography, and political science
7f7bccd5-0297-407e-bd71-181cee0f22f6	2025-10-24 06:41:33.679328+00	65a81640-ba85-49cd-af0a-5564f2233738	Languages and Literature	Multiple language studies
fd8fcd87-4c4a-4fe9-84d9-da240af37376	2025-10-24 06:41:33.679328+00	65a81640-ba85-49cd-af0a-5564f2233738	Social Sciences	Psychology, sociology, and anthropology
e303d256-6d33-4f2d-bce2-108fe24fa0fa	2025-10-24 06:41:33.679328+00	65a81640-ba85-49cd-af0a-5564f2233738	Fine Arts	Visual arts, music, and performing arts
2a545ad9-f16e-4736-9df9-d0aa4454907b	2025-10-24 06:41:33.679328+00	fd32778e-4087-43fa-80cc-3c64a152dd6a	Industrial Technology	Manufacturing and industrial skills
331a005b-c21b-4d91-b8fe-849ce2f0b675	2025-10-24 06:41:33.679328+00	fd32778e-4087-43fa-80cc-3c64a152dd6a	Information Technology	Computer and networking skills
540ede96-be36-4bbf-bcfb-9cb69d4eaa73	2025-10-24 06:41:33.679328+00	fd32778e-4087-43fa-80cc-3c64a152dd6a	Automotive Technology	Vehicle maintenance and repair
86f0613b-0e1d-45ad-801a-8fc8b9861b5c	2025-10-24 06:41:33.679328+00	fd32778e-4087-43fa-80cc-3c64a152dd6a	Construction Technology	Building trades and construction
11c93385-01ed-47f8-9258-b85059602210	2025-10-24 06:41:33.679328+00	fd32778e-4087-43fa-80cc-3c64a152dd6a	Culinary Arts	Food service and hospitality
bb8654c9-e546-400a-bac4-9d6709f129ad	2025-10-24 06:41:33.679328+00	fd32778e-4087-43fa-80cc-3c64a152dd6a	Health Sciences	Healthcare career preparation
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.users (id, email, role, phone_number, is_active, created_at, updated_at, password, full_name, profile_picture_url, status, email_verified, oauth_provider, oauth_id, bio, timezone, last_login_ip, last_login_at, password_iv, password_tag, password_algo) FROM stdin;
f0f6c256-52fc-482c-8dcf-b04a6ae063d9	aamir.ibrinfotech@gmail.com	user	2335365346	t	2025-10-24 10:40:44.603+00	2025-10-27 10:56:51.550996+00	xrArlWkrioWd6+hNZzeN5w==	Aamir	\N	false	t	\N	\N	\N	\N	\N	\N	v/WdNJIBxOq5Gnh/	K1y5m11bLFCt6ATYw7DM5A==	aes-256-gcm
8495e061-937f-446a-a697-630f610b8e72	alice.smith@example.com	user	\N	t	2025-10-28 09:24:36.019+00	2025-10-28 09:24:36.019+00	ivUdO8wVBi6grFPjvUyiGQ==	Alice Smith	\N	active	t	\N	\N	\N	\N	\N	\N	J9purQU8MenyVoRC	rl4NvYJquZ3yCp1AmDwKHA==	aes-256-gcm
e525a509-4758-464a-9edc-efcec900d106	abhi@gmail.com	user	9876543210	t	2025-10-28 09:25:33.639+00	2025-10-28 09:25:33.639+00	X3/J/p3v/OTSGGCj9A6tVw==	Abhi Patel 	\N	active	t	\N	\N	\N	\N	\N	\N	zyO7l7mIQtoclGa4	5+3MOV487yTShJ03frqxYQ==	aes-256-gcm
15b74b11-a982-4e43-8e7d-002f0cd2c11e	abhi2@gmail.com	user	9876543210	t	2025-10-28 09:26:05.795+00	2025-10-28 09:26:05.796+00	Ou8lM+NWFa5JIXgwkdhQoQ==	Abhi Patel 	\N	active	t	\N	\N	\N	\N	\N	\N	kxpKTIRB1uHWlyI9	FjrPwyslzSnmamlOZDQPJw==	aes-256-gcm
bb6291cb-fc15-4756-827d-7965ace6cf5e	sharmaji@gmail.com	user	9876543210	t	2025-10-28 12:47:41.879+00	2025-10-28 12:47:41.879+00	Wd59vCZxUsBkcWyG87cwGw==	Sharma ji	\N	active	t	\N	\N	\N	\N	\N	\N	McP2EXMVcobPavBh	4RLkYXNM/yCw4Z67e7WmFg==	aes-256-gcm
27325589-065e-45a4-be45-fdb4a6a0c3bf	admin@example.com	admin	\N	t	2025-10-17 09:23:59.325+00	2025-10-28 12:49:25.908704+00	\N	\N	\N	active	t	\N	\N	\N	\N	this would be the ip of the request	2025-10-28 12:49:25.35+00	\N	\N	aes-256-gcm
2f393221-61ad-47e8-aee4-3ecdff2d6247	parivesh@ibrinfotech.com	user	\N	t	2025-10-17 09:26:11.985+00	2025-10-27 10:05:10.109492+00	\N	\N	\N	true	f	\N	\N	\N	\N	\N	\N	\N	\N	aes-256-gcm
e8b5f27d-ccc5-43b8-b54e-67d5deacb26c	sharmajikaladka@gmail.com	user	9876543210	t	2025-10-28 12:59:55.786+00	2025-10-28 12:59:55.786+00	HY6euY3W5GeQgsBCsf5LwQ==	Sharma ji ka ladka	\N	active	t	\N	\N	\N	\N	\N	\N	6vEG/UyVy2uM8Qt+	LV+GU5Cg31yccm448S+Ivg==	aes-256-gcm
b0cc2354-83a6-417c-ac4c-915914906a20	nikhil.jain@ibrinfotech.com	user	7000198790	t	2025-10-24 10:13:10.818+00	2025-10-24 10:13:10.818+00	pflw4um455cB6e+EUBnyPQ==	Nikhil Jain	\N	active	t	\N	\N	\N	\N	\N	\N	tf7hASlXaghYhSH1	SoxtvtyPFrYJvUbA+vk42g==	aes-256-gcm
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-10-17 06:40:50
20211116045059	2025-10-17 06:40:50
20211116050929	2025-10-17 06:40:50
20211116051442	2025-10-17 06:40:50
20211116212300	2025-10-17 06:40:50
20211116213355	2025-10-17 06:40:50
20211116213934	2025-10-17 06:40:50
20211116214523	2025-10-17 06:40:50
20211122062447	2025-10-17 06:40:50
20211124070109	2025-10-17 06:40:50
20211202204204	2025-10-17 06:40:50
20211202204605	2025-10-17 06:40:50
20211210212804	2025-10-17 06:40:50
20211228014915	2025-10-17 06:40:50
20220107221237	2025-10-17 06:40:50
20220228202821	2025-10-17 06:40:50
20220312004840	2025-10-17 06:40:50
20220603231003	2025-10-17 06:40:50
20220603232444	2025-10-17 06:40:50
20220615214548	2025-10-17 06:40:50
20220712093339	2025-10-17 06:40:50
20220908172859	2025-10-17 06:40:50
20220916233421	2025-10-17 06:40:50
20230119133233	2025-10-17 06:40:50
20230128025114	2025-10-17 06:40:50
20230128025212	2025-10-17 06:40:50
20230227211149	2025-10-17 06:40:50
20230228184745	2025-10-17 06:40:50
20230308225145	2025-10-17 06:40:50
20230328144023	2025-10-17 06:40:50
20231018144023	2025-10-17 06:40:50
20231204144023	2025-10-17 06:40:50
20231204144024	2025-10-17 06:40:50
20231204144025	2025-10-17 06:40:50
20240108234812	2025-10-17 06:40:50
20240109165339	2025-10-17 06:40:50
20240227174441	2025-10-17 06:40:50
20240311171622	2025-10-17 06:40:50
20240321100241	2025-10-17 06:40:50
20240401105812	2025-10-17 06:40:50
20240418121054	2025-10-17 06:40:50
20240523004032	2025-10-17 06:40:51
20240618124746	2025-10-17 06:40:51
20240801235015	2025-10-17 06:40:51
20240805133720	2025-10-17 06:40:51
20240827160934	2025-10-17 06:40:51
20240919163303	2025-10-17 06:40:51
20240919163305	2025-10-17 06:40:51
20241019105805	2025-10-17 06:40:51
20241030150047	2025-10-17 06:40:51
20241108114728	2025-10-17 06:40:51
20241121104152	2025-10-17 06:40:51
20241130184212	2025-10-17 06:40:51
20241220035512	2025-10-17 06:40:51
20241220123912	2025-10-17 06:40:51
20241224161212	2025-10-17 06:40:51
20250107150512	2025-10-17 06:40:51
20250110162412	2025-10-17 06:40:51
20250123174212	2025-10-17 06:40:51
20250128220012	2025-10-17 06:40:51
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-10-17 06:40:35.385869
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-10-17 06:40:35.401246
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-10-17 06:40:35.409161
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-10-17 06:40:35.442536
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-10-17 06:40:35.475875
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-10-17 06:40:35.483944
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-10-17 06:40:35.490945
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-10-17 06:40:35.498764
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-10-17 06:40:35.503061
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-10-17 06:40:35.510765
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-10-17 06:40:35.517326
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-10-17 06:40:35.524659
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-10-17 06:40:35.532749
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-10-17 06:40:35.537104
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-10-17 06:40:35.541353
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-10-17 06:40:35.569448
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-10-17 06:40:35.57474
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-10-17 06:40:35.578501
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-10-17 06:40:35.582928
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-10-17 06:40:35.590798
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-10-17 06:40:35.595539
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-10-17 06:40:35.60248
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-10-17 06:40:35.625295
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-10-17 06:40:35.652138
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-10-17 06:40:35.664343
25	custom-metadata	67eb93b7e8d401cafcdc97f9ac779e71a79bfe03	2025-10-17 06:40:35.670363
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--

COPY supabase_functions.hooks (id, hook_table_id, hook_name, created_at, request_id) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--

COPY supabase_functions.migrations (version, inserted_at) FROM stdin;
initial	2025-10-17 06:39:52.944873+00
20210809183423_update_grants	2025-10-17 06:39:52.944873+00
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 101, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('pgsodium.key_key_id_seq', 1, false);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('supabase_functions.hooks_id_seq', 1, false);


--
-- Name: extensions extensions_pkey; Type: CONSTRAINT; Schema: _realtime; Owner: supabase_admin
--

ALTER TABLE ONLY _realtime.extensions
    ADD CONSTRAINT extensions_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: _realtime; Owner: supabase_admin
--

ALTER TABLE ONLY _realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: _realtime; Owner: supabase_admin
--

ALTER TABLE ONLY _realtime.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: academic_entries academic_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.academic_entries
    ADD CONSTRAINT academic_entries_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: custom_programs_fields custom_enquiry_fields_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.custom_programs_fields
    ADD CONSTRAINT custom_enquiry_fields_pkey PRIMARY KEY (id);


--
-- Name: custom_fields custom_fields_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.custom_fields
    ADD CONSTRAINT custom_fields_pkey PRIMARY KEY (id);


--
-- Name: education_levels education_levels_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.education_levels
    ADD CONSTRAINT education_levels_pkey PRIMARY KEY (id);


--
-- Name: enquiries_backup enquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.enquiries_backup
    ADD CONSTRAINT enquiries_pkey PRIMARY KEY (id);


--
-- Name: enquiries enquiries_pkey1; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.enquiries
    ADD CONSTRAINT enquiries_pkey1 PRIMARY KEY (id);


--
-- Name: interest_information interest_information_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.interest_information
    ADD CONSTRAINT interest_information_pkey PRIMARY KEY (id);


--
-- Name: programs programs_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_pkey PRIMARY KEY (id);


--
-- Name: streams streams_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.streams
    ADD CONSTRAINT streams_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: hooks hooks_pkey; Type: CONSTRAINT; Schema: supabase_functions; Owner: supabase_functions_admin
--

ALTER TABLE ONLY supabase_functions.hooks
    ADD CONSTRAINT hooks_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: supabase_functions; Owner: supabase_functions_admin
--

ALTER TABLE ONLY supabase_functions.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (version);


--
-- Name: extensions_tenant_external_id_index; Type: INDEX; Schema: _realtime; Owner: supabase_admin
--

CREATE INDEX extensions_tenant_external_id_index ON _realtime.extensions USING btree (tenant_external_id);


--
-- Name: extensions_tenant_external_id_type_index; Type: INDEX; Schema: _realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX extensions_tenant_external_id_type_index ON _realtime.extensions USING btree (tenant_external_id, type);


--
-- Name: tenants_external_id_index; Type: INDEX; Schema: _realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX tenants_external_id_index ON _realtime.tenants USING btree (external_id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: idx_enquiries_assigned_user; Type: INDEX; Schema: public; Owner: supabase_admin
--

CREATE INDEX idx_enquiries_assigned_user ON public.enquiries_backup USING btree (quried_by_user);


--
-- Name: idx_enquiries_email; Type: INDEX; Schema: public; Owner: supabase_admin
--

CREATE INDEX idx_enquiries_email ON public.enquiries_backup USING btree (email);


--
-- Name: idx_enquiries_status; Type: INDEX; Schema: public; Owner: supabase_admin
--

CREATE INDEX idx_enquiries_status ON public.enquiries_backup USING btree (status);


--
-- Name: idx_programs_study_area; Type: INDEX; Schema: public; Owner: supabase_admin
--

CREATE INDEX idx_programs_study_area ON public.programs USING btree (study_area);


--
-- Name: idx_programs_study_level; Type: INDEX; Schema: public; Owner: supabase_admin
--

CREATE INDEX idx_programs_study_level ON public.programs USING btree (study_level);


--
-- Name: idx_programs_university; Type: INDEX; Schema: public; Owner: supabase_admin
--

CREATE INDEX idx_programs_university ON public.programs USING btree (university);


--
-- Name: idx_users_active; Type: INDEX; Schema: public; Owner: supabase_admin
--

CREATE INDEX idx_users_active ON public.users USING btree (is_active);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: supabase_admin
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: supabase_functions_hooks_h_table_id_h_name_idx; Type: INDEX; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE INDEX supabase_functions_hooks_h_table_id_h_name_idx ON supabase_functions.hooks USING btree (hook_table_id, hook_name);


--
-- Name: supabase_functions_hooks_request_id_idx; Type: INDEX; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE INDEX supabase_functions_hooks_request_id_idx ON supabase_functions.hooks USING btree (request_id);


--
-- Name: enquiries_backup update_enquiries_updated_at; Type: TRIGGER; Schema: public; Owner: supabase_admin
--

CREATE TRIGGER update_enquiries_updated_at BEFORE UPDATE ON public.enquiries_backup FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: programs update_programs_updated_at; Type: TRIGGER; Schema: public; Owner: supabase_admin
--

CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON public.programs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: supabase_admin
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: extensions extensions_tenant_external_id_fkey; Type: FK CONSTRAINT; Schema: _realtime; Owner: supabase_admin
--

ALTER TABLE ONLY _realtime.extensions
    ADD CONSTRAINT extensions_tenant_external_id_fkey FOREIGN KEY (tenant_external_id) REFERENCES _realtime.tenants(external_id) ON DELETE CASCADE;


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: academic_entries academic_entries_course_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.academic_entries
    ADD CONSTRAINT academic_entries_course_fkey FOREIGN KEY (course) REFERENCES public.courses(id);


--
-- Name: academic_entries academic_entries_enquiry_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.academic_entries
    ADD CONSTRAINT academic_entries_enquiry_id_fkey FOREIGN KEY (enquiry_id) REFERENCES public.enquiries(id) ON DELETE CASCADE;


--
-- Name: academic_entries academic_entries_stream_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.academic_entries
    ADD CONSTRAINT academic_entries_stream_fkey FOREIGN KEY (stream) REFERENCES public.streams(id);


--
-- Name: academic_entries academic_entries_study_level_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.academic_entries
    ADD CONSTRAINT academic_entries_study_level_fkey FOREIGN KEY (study_level) REFERENCES public.education_levels(id);


--
-- Name: courses courses_level_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_level_id_fkey FOREIGN KEY (level_id) REFERENCES public.education_levels(id) ON DELETE CASCADE;


--
-- Name: custom_programs_fields custom_enquiry_fields_program_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.custom_programs_fields
    ADD CONSTRAINT custom_enquiry_fields_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.programs(id);


--
-- Name: custom_programs_fields custom_programs_fields_custom_field_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.custom_programs_fields
    ADD CONSTRAINT custom_programs_fields_custom_field_fkey FOREIGN KEY (custom_field) REFERENCES public.custom_fields(id);


--
-- Name: enquiries enquiries_createdby_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.enquiries
    ADD CONSTRAINT enquiries_createdby_fkey FOREIGN KEY (createdby) REFERENCES public.users(id);


--
-- Name: enquiries_backup enquiries_quried_by_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.enquiries_backup
    ADD CONSTRAINT enquiries_quried_by_user_fkey FOREIGN KEY (quried_by_user) REFERENCES public.users(id);


--
-- Name: interest_information interest_information_course_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.interest_information
    ADD CONSTRAINT interest_information_course_fkey FOREIGN KEY (course) REFERENCES public.courses(id);


--
-- Name: interest_information interest_information_enquiry_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.interest_information
    ADD CONSTRAINT interest_information_enquiry_id_fkey FOREIGN KEY (enquiry_id) REFERENCES public.enquiries(id) ON DELETE CASCADE;


--
-- Name: interest_information interest_information_stream_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.interest_information
    ADD CONSTRAINT interest_information_stream_fkey FOREIGN KEY (stream) REFERENCES public.streams(id);


--
-- Name: interest_information interest_information_study_level_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.interest_information
    ADD CONSTRAINT interest_information_study_level_fkey FOREIGN KEY (study_level) REFERENCES public.education_levels(id);


--
-- Name: streams streams_course_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.streams
    ADD CONSTRAINT streams_course_fkey FOREIGN KEY (course) REFERENCES public.courses(id);


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: programs Admin can do everything on programs; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Admin can do everything on programs" ON public.programs USING ((EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.email = (auth.jwt() ->> 'email'::text)) AND (users.role = 'admin'::text) AND (users.is_active = true)))));


--
-- Name: enquiries_backup Admin can read all enquiries; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Admin can read all enquiries" ON public.enquiries_backup FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.email = (auth.jwt() ->> 'email'::text)) AND (users.role = 'admin'::text) AND (users.is_active = true)))));


--
-- Name: users Admins can delete users; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Admins can delete users" ON public.users FOR DELETE TO authenticated USING (public.is_admin());


--
-- Name: users Admins can insert users; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Admins can insert users" ON public.users FOR INSERT TO authenticated WITH CHECK (public.is_admin());


--
-- Name: users Admins can update any user; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Admins can update any user" ON public.users FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: enquiries_backup Students can create enquiries; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Students can create enquiries" ON public.enquiries_backup FOR INSERT WITH CHECK (true);


--
-- Name: programs Users can read programs; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Users can read programs" ON public.programs FOR SELECT USING (true);


--
-- Name: enquiries_backup Users can read their assigned enquiries; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Users can read their assigned enquiries" ON public.enquiries_backup FOR SELECT USING ((quried_by_user IN ( SELECT users.id
   FROM public.users
  WHERE ((users.email = (auth.jwt() ->> 'email'::text)) AND (users.is_active = true)))));


--
-- Name: users Users can update own data; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Users can update own data" ON public.users FOR UPDATE TO authenticated USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));


--
-- Name: enquiries_backup Users can update their assigned enquiries; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Users can update their assigned enquiries" ON public.enquiries_backup FOR UPDATE USING ((quried_by_user IN ( SELECT users.id
   FROM public.users
  WHERE ((users.email = (auth.jwt() ->> 'email'::text)) AND (users.is_active = true)))));


--
-- Name: users Users can view own data; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Users can view own data" ON public.users FOR SELECT TO authenticated USING (((auth.uid() = id) OR public.is_admin()));


--
-- Name: custom_fields; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.custom_fields ENABLE ROW LEVEL SECURITY;

--
-- Name: enquiries_backup; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.enquiries_backup ENABLE ROW LEVEL SECURITY;

--
-- Name: programs; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT ALL ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA net; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA net TO supabase_functions_admin;
GRANT USAGE ON SCHEMA net TO postgres;
GRANT USAGE ON SCHEMA net TO anon;
GRANT USAGE ON SCHEMA net TO authenticated;
GRANT USAGE ON SCHEMA net TO service_role;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT ALL ON SCHEMA storage TO postgres;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: SCHEMA supabase_functions; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA supabase_functions TO postgres;
GRANT USAGE ON SCHEMA supabase_functions TO anon;
GRANT USAGE ON SCHEMA supabase_functions TO authenticated;
GRANT USAGE ON SCHEMA supabase_functions TO service_role;
GRANT ALL ON SCHEMA supabase_functions TO supabase_functions_admin;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION algorithm_sign(signables text, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.algorithm_sign(signables text, secret text, algorithm text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.algorithm_sign(signables text, secret text, algorithm text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM postgres;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM postgres;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION sign(payload json, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.sign(payload json, secret text, algorithm text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.sign(payload json, secret text, algorithm text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION try_cast_double(inp text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.try_cast_double(inp text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.try_cast_double(inp text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION url_decode(data text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.url_decode(data text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.url_decode(data text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION url_encode(data bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.url_encode(data bytea) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.url_encode(data bytea) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION verify(token text, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.verify(token text, secret text, algorithm text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.verify(token text, secret text, algorithm text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: postgres
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;


--
-- Name: FUNCTION crypto_aead_det_decrypt(message bytea, additional bytea, key_uuid uuid, nonce bytea); Type: ACL; Schema: pgsodium; Owner: pgsodium_keymaker
--

GRANT ALL ON FUNCTION pgsodium.crypto_aead_det_decrypt(message bytea, additional bytea, key_uuid uuid, nonce bytea) TO service_role;


--
-- Name: FUNCTION crypto_aead_det_encrypt(message bytea, additional bytea, key_uuid uuid, nonce bytea); Type: ACL; Schema: pgsodium; Owner: pgsodium_keymaker
--

GRANT ALL ON FUNCTION pgsodium.crypto_aead_det_encrypt(message bytea, additional bytea, key_uuid uuid, nonce bytea) TO service_role;


--
-- Name: FUNCTION crypto_aead_det_keygen(); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

GRANT ALL ON FUNCTION pgsodium.crypto_aead_det_keygen() TO service_role;


--
-- Name: FUNCTION is_admin(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.is_admin() TO postgres;
GRANT ALL ON FUNCTION public.is_admin() TO anon;
GRANT ALL ON FUNCTION public.is_admin() TO authenticated;
GRANT ALL ON FUNCTION public.is_admin() TO service_role;


--
-- Name: FUNCTION update_updated_at_column(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.update_updated_at_column() TO postgres;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO anon;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO authenticated;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO service_role;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION http_request(); Type: ACL; Schema: supabase_functions; Owner: supabase_functions_admin
--

REVOKE ALL ON FUNCTION supabase_functions.http_request() FROM PUBLIC;
GRANT ALL ON FUNCTION supabase_functions.http_request() TO anon;
GRANT ALL ON FUNCTION supabase_functions.http_request() TO authenticated;
GRANT ALL ON FUNCTION supabase_functions.http_request() TO service_role;
GRANT ALL ON FUNCTION supabase_functions.http_request() TO postgres;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.schema_migrations TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.schema_migrations TO postgres;
GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;


--
-- Name: TABLE decrypted_key; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

GRANT ALL ON TABLE pgsodium.decrypted_key TO pgsodium_keyholder;


--
-- Name: TABLE masking_rule; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

GRANT ALL ON TABLE pgsodium.masking_rule TO pgsodium_keyholder;


--
-- Name: TABLE mask_columns; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

GRANT ALL ON TABLE pgsodium.mask_columns TO pgsodium_keyholder;


--
-- Name: TABLE academic_entries; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.academic_entries TO postgres;
GRANT ALL ON TABLE public.academic_entries TO anon;
GRANT ALL ON TABLE public.academic_entries TO authenticated;
GRANT ALL ON TABLE public.academic_entries TO service_role;


--
-- Name: TABLE courses; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.courses TO postgres;
GRANT ALL ON TABLE public.courses TO anon;
GRANT ALL ON TABLE public.courses TO authenticated;
GRANT ALL ON TABLE public.courses TO service_role;


--
-- Name: TABLE custom_fields; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.custom_fields TO postgres;
GRANT ALL ON TABLE public.custom_fields TO anon;
GRANT ALL ON TABLE public.custom_fields TO authenticated;
GRANT ALL ON TABLE public.custom_fields TO service_role;


--
-- Name: TABLE custom_programs_fields; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.custom_programs_fields TO postgres;
GRANT ALL ON TABLE public.custom_programs_fields TO anon;
GRANT ALL ON TABLE public.custom_programs_fields TO authenticated;
GRANT ALL ON TABLE public.custom_programs_fields TO service_role;


--
-- Name: TABLE education_levels; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.education_levels TO postgres;
GRANT ALL ON TABLE public.education_levels TO anon;
GRANT ALL ON TABLE public.education_levels TO authenticated;
GRANT ALL ON TABLE public.education_levels TO service_role;


--
-- Name: TABLE enquiries; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.enquiries TO postgres;
GRANT ALL ON TABLE public.enquiries TO anon;
GRANT ALL ON TABLE public.enquiries TO authenticated;
GRANT ALL ON TABLE public.enquiries TO service_role;


--
-- Name: TABLE enquiries_backup; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.enquiries_backup TO postgres;
GRANT ALL ON TABLE public.enquiries_backup TO anon;
GRANT ALL ON TABLE public.enquiries_backup TO authenticated;
GRANT ALL ON TABLE public.enquiries_backup TO service_role;


--
-- Name: TABLE interest_information; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.interest_information TO postgres;
GRANT ALL ON TABLE public.interest_information TO anon;
GRANT ALL ON TABLE public.interest_information TO authenticated;
GRANT ALL ON TABLE public.interest_information TO service_role;


--
-- Name: TABLE programs; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.programs TO postgres;
GRANT ALL ON TABLE public.programs TO anon;
GRANT ALL ON TABLE public.programs TO authenticated;
GRANT ALL ON TABLE public.programs TO service_role;


--
-- Name: TABLE streams; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.streams TO postgres;
GRANT ALL ON TABLE public.streams TO anon;
GRANT ALL ON TABLE public.streams TO authenticated;
GRANT ALL ON TABLE public.streams TO service_role;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.users TO postgres;
GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO postgres;


--
-- Name: TABLE migrations; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.migrations TO anon;
GRANT ALL ON TABLE storage.migrations TO authenticated;
GRANT ALL ON TABLE storage.migrations TO service_role;
GRANT ALL ON TABLE storage.migrations TO postgres;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO postgres;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- Name: TABLE hooks; Type: ACL; Schema: supabase_functions; Owner: supabase_functions_admin
--

GRANT ALL ON TABLE supabase_functions.hooks TO anon;
GRANT ALL ON TABLE supabase_functions.hooks TO authenticated;
GRANT ALL ON TABLE supabase_functions.hooks TO service_role;


--
-- Name: SEQUENCE hooks_id_seq; Type: ACL; Schema: supabase_functions; Owner: supabase_functions_admin
--

GRANT ALL ON SEQUENCE supabase_functions.hooks_id_seq TO anon;
GRANT ALL ON SEQUENCE supabase_functions.hooks_id_seq TO authenticated;
GRANT ALL ON SEQUENCE supabase_functions.hooks_id_seq TO service_role;


--
-- Name: TABLE migrations; Type: ACL; Schema: supabase_functions; Owner: supabase_functions_admin
--

GRANT ALL ON TABLE supabase_functions.migrations TO anon;
GRANT ALL ON TABLE supabase_functions.migrations TO authenticated;
GRANT ALL ON TABLE supabase_functions.migrations TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES  TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS  TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES  TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: pgsodium; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium GRANT ALL ON SEQUENCES  TO pgsodium_keyholder;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: pgsodium; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium GRANT ALL ON TABLES  TO pgsodium_keyholder;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: pgsodium_masks; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium_masks GRANT ALL ON SEQUENCES  TO pgsodium_keyiduser;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: pgsodium_masks; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium_masks GRANT ALL ON FUNCTIONS  TO pgsodium_keyiduser;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: pgsodium_masks; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium_masks GRANT ALL ON TABLES  TO pgsodium_keyiduser;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: supabase_functions; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA supabase_functions GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA supabase_functions GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA supabase_functions GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA supabase_functions GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: supabase_functions; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA supabase_functions GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA supabase_functions GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA supabase_functions GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA supabase_functions GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: supabase_functions; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA supabase_functions GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA supabase_functions GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA supabase_functions GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA supabase_functions GRANT ALL ON TABLES  TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: postgres
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO postgres;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

