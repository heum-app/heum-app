import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { useBottomSheetStore } from '@/store/commonStore';

export default function BottomSheetModal() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { index, contentStack, close } = useBottomSheetStore();
  const content = contentStack[contentStack.length - 1] ?? null;

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    [],
  );

  useEffect(() => {
    if (!bottomSheetRef.current) return;

    if (index === -1) {
      bottomSheetRef.current.close(); // 실제 close 애니메이션 실행
    } else {
      bottomSheetRef.current.expand();
    }
  }, [index]);

  return (
    <View style={styles.wrapper} pointerEvents={index === -1 ? 'none' : 'box-none'}>
      <BottomSheet
        ref={bottomSheetRef}
        index={index}
        onClose={close}
        enablePanDownToClose
        enableDynamicSizing={false}
        snapPoints={['72%']}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={styles.handleIndicator}
        handleComponent={null} // 기본 손잡이 제거
        backgroundStyle={styles.background}
        enableContentPanningGesture={false} // 내부 스크롤 외 터치로 Sheet 움직이지 않음
      >
        <BottomSheetView style={styles.sheetContent}>{content}</BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  background: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  handleIndicator: {
    width: 38,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ddd',
  },
  sheetContent: {
    flex: 1,
    overflow: 'hidden',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: '#fff',
  },
});
