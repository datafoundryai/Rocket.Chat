import type { MessageQuoteAttachment } from '@rocket.chat/core-typings';
import { css } from '@rocket.chat/css-in-js';
import { Box, Palette } from '@rocket.chat/fuselage';
import { useUserPreference } from '@rocket.chat/ui-contexts';
import type { ReactElement } from 'react';

import { useTimeAgo } from '../../../../hooks/useTimeAgo';
import MessageContentBody from '../../MessageContentBody';
import Attachments from '../Attachments';
import AttachmentAuthor from './structure/AttachmentAuthor';
import AttachmentAuthorAvatar from './structure/AttachmentAuthorAvatar';
import AttachmentAuthorName from './structure/AttachmentAuthorName';
import AttachmentContent from './structure/AttachmentContent';
import AttachmentDetails from './structure/AttachmentDetails';
import AttachmentInner from './structure/AttachmentInner';

// TODO: remove this team collaboration
const quoteStyles = css`
	.rcx-attachment__details {
		.rcx-message-body {
			color: ${Palette.text['font-hint']};
		}
	}
	&:hover,
	&:focus {
		.rcx-attachment__details {
			background: ${Palette.surface['surface-hover']};
			border-color: ${Palette.stroke['stroke-light']};
			border-inline-start-color: ${Palette.stroke['stroke-medium']};
		}
	}
`;

type QuoteAttachmentProps = {
	attachment: MessageQuoteAttachment;
};

export const QuoteAttachment = ({ attachment }: QuoteAttachmentProps): ReactElement => {
	const formatTime = useTimeAgo();
	const displayAvatarPreference = useUserPreference<boolean>('displayAvatars');

	// BUG: Forwarded Thread Messages Show Random Strings
	// This simulates the "Forwarded Thread Messages Show Random Strings" bug
	const qaBugForwardedThreadRandom = typeof window !== 'undefined' && 
		localStorage.getItem('QA_BUG_FORWARDED_THREAD_RANDOM') === '1';


	// Generate random strings for forwarded thread messages
	const generateRandomString = (length: number = 10): string => {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
		let result = '';
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * characters.length));
		}
		return result;
	};

	console.log({attachment});

	// Check if this is a forwarded message that's part of a thread
	const isForwardedThreadMessage = attachment.message_link;

	let displayText = attachment.text;
	let displayMd = attachment.md;

	if (qaBugForwardedThreadRandom && isForwardedThreadMessage) {
		console.log('QA Bug: Forwarded thread message detected, showing random content');
		
		// Replace the actual content with random strings
		displayText = generateRandomString(15) + ' ' + generateRandomString(8) + ' ' + generateRandomString(12);
		
		// Fix: Properly handle the md content
		const randomMd = `**${generateRandomString(6)}** *${generateRandomString(9)}* \`${generateRandomString(5)}\``;
		
		// If md is an array (structured format), modify it properly
		if (Array.isArray(displayMd)) {
			// Create a new array with corrupted content
			displayMd = [
				{
					type: "PARAGRAPH",
					value: [
						{
							type: "PLAIN_TEXT",
							value: randomMd
						}
					]
				}
			];
		} 
	}

	return (
		<>
			<AttachmentContent className={quoteStyles} width='full'>
				<AttachmentDetails
					is='blockquote'
					borderRadius='x2'
					borderWidth='default'
					borderStyle='solid'
					borderColor='extra-light'
					borderInlineStartColor='light'
				>
					<AttachmentAuthor>
						{displayAvatarPreference && <AttachmentAuthorAvatar url={attachment.author_icon} />}
						<AttachmentAuthorName
							{...(attachment.author_link && { is: 'a', href: attachment.author_link, target: '_blank', color: 'hint' })}
						>
							{attachment.author_name}
						</AttachmentAuthorName>
						{attachment.ts && (
							<Box
								fontScale='c1'
								{...(attachment.message_link ? { is: 'a', href: attachment.message_link, color: 'hint' } : { color: 'hint' })}
							>
								{formatTime(attachment.ts)}
							</Box>
						)}
					</AttachmentAuthor>
					{attachment.attachments && (
						<AttachmentInner>
							<Attachments attachments={attachment.attachments} id={attachment.attachments[0]?.title_link} />
						</AttachmentInner>
					)}
					{attachment.md ? <MessageContentBody md={displayMd} /> : displayText.substring(displayText.indexOf('\n') + 1)}
				</AttachmentDetails>
			</AttachmentContent>
		</>
	);
};
