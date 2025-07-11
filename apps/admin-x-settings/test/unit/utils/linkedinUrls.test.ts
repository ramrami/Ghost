import * as assert from 'assert/strict';
import {linkedinHandleToUrl, linkedinUrlToHandle, validateLinkedInUrl} from '../../../src/utils/socialUrls/index';

describe('LinkedIn URLs', () => {
    describe('URL validation', () => {
        it('should return empty string when input is empty', () => {
            assert.equal(validateLinkedInUrl(''), '');
        });

        it('should format various LinkedIn URL formats correctly', () => {
            assert.equal(validateLinkedInUrl('linkedin.com/in/johnsmith'), 'https://www.linkedin.com/in/johnsmith');
            assert.equal(validateLinkedInUrl('https://www.linkedin.com/in/johnsmith'), 'https://www.linkedin.com/in/johnsmith');
            assert.equal(validateLinkedInUrl('ca.linkedin.com/in/john-smith'), 'https://ca.linkedin.com/in/john-smith');
            assert.equal(validateLinkedInUrl('linkedin.com/pub/john-smith-abc123'), 'https://www.linkedin.com/pub/john-smith-abc123');
            assert.equal(validateLinkedInUrl('linkedin.com/company/ghost-foundation'), 'https://www.linkedin.com/company/ghost-foundation');
            assert.equal(validateLinkedInUrl('linkedin.com/school/mit'), 'https://www.linkedin.com/school/mit');
            assert.equal(validateLinkedInUrl('company/ghost-foundation'), 'https://www.linkedin.com/company/ghost-foundation');
            assert.equal(validateLinkedInUrl('school/mit'), 'https://www.linkedin.com/school/mit');
            assert.equal(validateLinkedInUrl('@johnsmith'), 'https://www.linkedin.com/in/johnsmith');
            assert.equal(validateLinkedInUrl('johnsmith'), 'https://www.linkedin.com/in/johnsmith');
        });

        it('should reject URLs from other domains', () => {
            assert.throws(() => validateLinkedInUrl('https://twitter.com/johnsmith'), /The URL must be in a format like https:\/\/www\.linkedin\.com\/in\/yourUsername/);
            assert.throws(() => validateLinkedInUrl('http://example.com'), /The URL must be in a format like https:\/\/www\.linkedin\.com\/in\/yourUsername/);
        });

        it('should reject invalid LinkedIn usernames', () => {
            assert.throws(() => validateLinkedInUrl('linkedin.com/in/john@smith'), /Your Username is not a valid LinkedIn Username/);
            assert.throws(() => validateLinkedInUrl('linkedin.com/in/john#smith'), /Your Username is not a valid LinkedIn Username/);
            assert.throws(() => validateLinkedInUrl('linkedin.com/in/' + 'a'.repeat(101)), /Your Username is not a valid LinkedIn Username/); // Too long
            assert.throws(() => validateLinkedInUrl('linkedin.com/in/johnsmith#fragment'), /Your Username is not a valid LinkedIn Username/);
            assert.throws(() => validateLinkedInUrl('linkedin.com/in/johnsmith?foo=1'), /Your Username is not a valid LinkedIn Username/);
        });

        it('should allow valid non-custom LinkedIn usernames', () => {
            assert.equal(validateLinkedInUrl('linkedin.com/pub/john-smith-abc123'), 'https://www.linkedin.com/pub/john-smith-abc123');
            assert.equal(validateLinkedInUrl('linkedin.com/pub/johnsmith/12/34/567'), 'https://www.linkedin.com/pub/johnsmith/12/34/567');
        });
    });

    describe('Handle to URL conversion', () => {
        it('should convert LinkedIn handle to full URL', () => {
            assert.equal(linkedinHandleToUrl('johnsmith'), 'https://www.linkedin.com/in/johnsmith');
            assert.equal(linkedinHandleToUrl('@johnsmith'), 'https://www.linkedin.com/in/johnsmith');
            assert.equal(linkedinHandleToUrl('john-smith'), 'https://www.linkedin.com/in/john-smith');
        });

        it('should reject invalid LinkedIn handles', () => {
            assert.throws(() => linkedinHandleToUrl('john@smith'), /Your Username is not a valid LinkedIn Username/);
            assert.throws(() => linkedinHandleToUrl('john#smith'), /Your Username is not a valid LinkedIn Username/);
            assert.throws(() => linkedinHandleToUrl('john.smith'), /Your Username is not a valid LinkedIn Username/);
            assert.throws(() => linkedinHandleToUrl('jo'), /Your Username is not a valid LinkedIn Username/); // Too short
            assert.throws(() => linkedinHandleToUrl('a'.repeat(101)), /Your Username is not a valid LinkedIn Username/); // Too long
        });
    });

    describe('URL to handle extraction', () => {
        it('should extract LinkedIn handle from URL', () => {
            assert.equal(linkedinUrlToHandle('https://www.linkedin.com/in/johnsmith'), 'johnsmith');
            assert.equal(linkedinUrlToHandle('https://www.linkedin.com/in/@johnsmith'), 'johnsmith');
            assert.equal(linkedinUrlToHandle('linkedin.com/in/johnsmith'), 'johnsmith');
            assert.equal(linkedinUrlToHandle('ca.linkedin.com/in/john-smith'), 'john-smith');
            assert.equal(linkedinUrlToHandle('linkedin.com/pub/john-smith-abc123'), 'pub/john-smith-abc123');
            assert.equal(linkedinUrlToHandle('https://www.linkedin.com/company/ghost-foundation'), 'company/ghost-foundation');
            assert.equal(linkedinUrlToHandle('linkedin.com/school/mit'), 'school/mit');
            assert.equal(linkedinUrlToHandle('linkedin.com/pub/johnsmith/12/34/567'), 'pub/johnsmith/12/34/567');
        });

        it('should return null for invalid LinkedIn URLs', () => {
            assert.equal(linkedinUrlToHandle('https://example.com/johnsmith'), null);
            assert.equal(linkedinUrlToHandle('invalid-url'), null);
        });
    });
}); 