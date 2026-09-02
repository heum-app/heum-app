import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { CommentItemProps } from '../type';

export const CommentItem = React.memo(function CommentItem({
  item,
  onLongPress,
}: CommentItemProps) {
  /** 작성 시간 계산 */
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return date.toLocaleDateString('ko-KR');
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval}달 전`;
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval}일 전`;
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval}시간 전`;
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval}분 전`;
    return '방금 전';
  };

  return (
    <Pressable style={styles.commentRow} onLongPress={() => onLongPress(item)}>
      <Image source={{ uri: item.user.profileImageUrl }} style={styles.avatar} />
      <View style={styles.commentTextContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.nickname}>{item.user?.nickname}</Text>
          <Text style={styles.time}>{timeAgo(new Date(item.createdAt))}</Text>
        </View>
        <Text style={styles.content}>{item.content}</Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  commentTextContent: {
    flex: 1,
    flexDirection: 'column',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  nickname: {
    fontWeight: '700',
    color: '#111',
    marginRight: 6,
  },
  time: {
    fontSize: 12,
    color: '#777',
  },
  content: {
    fontSize: 14,
    color: '#222',
  },
});
