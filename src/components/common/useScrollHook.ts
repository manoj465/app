import { onScrollEvent, useValue } from "react-native-redash";

interface useScroll_i {
    initialValue?: number
}
const useScroll = ({ initialValue = 0 }: useScroll_i) => {
    const valueY = useValue(initialValue)
    const onScroll = onScrollEvent({ y: valueY })

    return {
        onScroll,
        valueY
    }
}