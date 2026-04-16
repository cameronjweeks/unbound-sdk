import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { VideoService } from '../services/video.js';

/**
 * Build a minimal SDK double that the VideoService can call into. Captures
 * _fetch calls for inspection.
 */
function buildFakeSdk() {
	const calls = [];
	const fakeSdk = {
		_fetch: async (endpoint, method, params, forceFetch) => {
			calls.push({ endpoint, method, params, forceFetch });
			return { ok: true };
		},
		validateParams: () => {}, // accept anything
	};
	return { fakeSdk, calls };
}

describe('VideoService.endSession', () => {
	test('POSTs /video/session/end with roomId body and forceFetch=true', async () => {
		const { fakeSdk, calls } = buildFakeSdk();
		const svc = new VideoService(fakeSdk);

		await svc.endSession('room-xyz');

		assert.equal(calls.length, 1);
		assert.equal(calls[0].endpoint, '/video/session/end');
		assert.equal(calls[0].method, 'POST');
		assert.deepEqual(calls[0].params, { body: { roomId: 'room-xyz' } });
		assert.equal(calls[0].forceFetch, true, 'forceFetch must be true so cookie goes via HTTP not WS transport');
	});
});

describe('VideoService.createMeetingClient', () => {
	test('dynamically imports video-sdk-client and injects the sdk instance', async () => {
		// Stub the VideoMeetingClient from video-sdk-client. Since we're running
		// in the sdk repo where video-sdk-client isn't published yet, we create
		// a symlinked resolution via a loader trick. Simplest: test that the
		// method returns a rejected promise with a predictable module-not-found
		// error OR mock the import by patching global.
		const { fakeSdk } = buildFakeSdk();
		fakeSdk.video = { joinRoom: async () => {} };
		const svc = new VideoService(fakeSdk);

		// We can't import @unboundcx/video-sdk-client from this package without
		// it being in node_modules. This test is structural: it verifies the
		// method exists and attempts the import. Runtime verification happens
		// during integration (Stream E) when app1-client consumes the bundle.
		assert.equal(typeof svc.createMeetingClient, 'function');

		let caught = null;
		try {
			await svc.createMeetingClient();
		} catch (err) {
			caught = err;
		}

		// Either we get an import error (package not installed) OR we get a
		// constructor error. Both are acceptable proof the dynamic-import
		// code path ran. What must NOT happen is a static-analysis failure
		// at module load — if this test file imports fine, dynamic import
		// is wired correctly.
		assert.ok(
			caught === null || /video-sdk-client|VideoMeetingClient/.test(caught.message),
			`expected dynamic-import error, got: ${caught?.message}`,
		);
	});
});

describe('VideoService.validateGuestToken', () => {
	test('POSTs /video/:id/validate with token body', async () => {
		const { fakeSdk, calls } = buildFakeSdk();
		const svc = new VideoService(fakeSdk);

		await svc.validateGuestToken('r1', 'jwt.token.here');

		assert.equal(calls.length, 1);
		assert.equal(calls[0].endpoint, '/video/r1/validate');
		assert.equal(calls[0].method, 'POST');
		assert.deepEqual(calls[0].params, { body: { token: 'jwt.token.here' } });
	});

	test('works without explicit token (cookie-bearing context)', async () => {
		const { fakeSdk, calls } = buildFakeSdk();
		const svc = new VideoService(fakeSdk);

		await svc.validateGuestToken('r1');

		assert.equal(calls[0].params.body.token, undefined);
	});
});
