const fs = require('fs');

const jsonData = require('./conversations.json');

function getConversationMessages(conversation) {
    let messages = [];
    let currentNode = conversation.current_node;
    while (currentNode != null) {
        const node = conversation.mapping[currentNode];
        if (
            node.message &&
            node.message.content &&
            node.message.content.content_type === "text" &&
            node.message.content.parts.length > 0 &&
            node.message.content.parts[0].length > 0 &&
            (node.message.author.role !== "system" || node.message.metadata.is_user_system_message)
        ) {
            let author = node.message.author.role === "assistant" ? "ChatGPT" :
                         node.message.author.role === "system" && node.message.metadata.is_user_system_message ? "Custom user info" :
                         node.message.author.role;
            messages.push(`**${author}:** ${node.message.content.parts[0]}`);
        }
        currentNode = node.parent;
    }
    return messages.reverse();
}

jsonData.reverse().forEach((conversation, index) => {
    const messages = getConversationMessages(conversation);
    const title = conversation.title;
    const content = `title:: ${title}\n\n` + messages.join('\n\n');
    fs.writeFileSync(`GPT-chat-${index + 1}.md`, content);
});

