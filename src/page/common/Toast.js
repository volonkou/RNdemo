import Toast from 'react-native-root-toast';

export default function ToastComponent(content,time){

  let hh = Toast.show(content, {
      duration: Toast.durations.LONG,
      position: Toast.positions.CENTER,
      shadow: true
  });

  setTimeout(function () {
      Toast.hide(hh);
  }, time);

}
