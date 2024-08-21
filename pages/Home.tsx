import {
  View,
  Image,
  Pressable,
} from "react-native";
import React from "react";
import { useBalance } from "hooks/useBalance";
import { useAppStore } from "lib/state/appStore";
import { WalletConnection } from "~/pages/settings/wallets/WalletConnection";
import { useTransactions } from "hooks/useTransactions";
import { Link, Stack, useFocusEffect } from "expo-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Text } from "~/components/ui/text";
import { Settings2, MoveDown, MoveUp, ChevronDown } from "~/components/Icons";

import { Skeleton } from "~/components/ui/skeleton";
import { Nip47Transaction } from "@getalby/sdk/dist/NWCClient";
import { useGetFiatAmount } from "~/hooks/useGetFiatAmount";
import { LucideIcon } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "~/components/ui/button";

dayjs.extend(relativeTime);

export function Home() {
  const nwcClient = useAppStore((store) => store.nwcClient);
  const { data: balance, mutate: reloadBalance } = useBalance();
  const getFiatAmount = useGetFiatAmount();

  if (!nwcClient) {
    return <WalletConnection />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Home",
          headerTitle: () => (
            <Image
              className="w-12 h-12"
              source={require("../assets/adaptive-icon.png")}
            />
          ),
          headerRight: () => (
            <Link href="/settings">
              <View className="flex justify-center items-center">
                <Settings2 className="text-foreground" />
              </View>
            </Link>
          ),
        }}
      />
      <View className="h-full flex">
        <View className="grow flex flex-col items-center justify-center gap-4">
          <View className="w-full flex flex-row justify-center items-center gap-2">
            {balance ? (
              <>
                <Text className="text-secondary-foreground text-5xl font-bold2">
                  {new Intl.NumberFormat().format(Math.floor(balance.balance / 1000))}
                </Text>
                <Text className="text-muted-foreground text-5xl font-bold2">
                  sats
                </Text>
              </>
            ) : (
              <Skeleton className="w-48 h-12" />
            )}
          </View>
          <View className="flex justify-center items-center">
            {getFiatAmount && balance ? (
              <Text className="text-center text-3xl text-muted-foreground font-bold2">
                {getFiatAmount(Math.floor(balance.balance / 1000))}
              </Text>
            ) : (
              <Skeleton className="w-32 h-10" />
            )}
          </View>
        </View>
        <View className="flex items-center justify-center">
          <Link href="/transactions" asChild>
            <ChevronDown className="text-secondary-foreground" />
          </Link>
        </View>
        <View>
          <View className="flex flex-row gap-6 p-6">
            <MainButton title="Receive" href="/receive" Icon={MoveDown} />
            <MainButton title="Send" href="/send" Icon={MoveUp} />
          </View>
        </View>
      </View>
    </>
  );
}

function MainButton({ title, href, Icon }: { title: string, href: string, Icon: LucideIcon, }): JSX.Element {
  return (
    <>
      <Link href={href} className="flex-1" asChild>
        <Pressable className="flex-1 aspect-square rounded-xl flex items-center justify-center">
          <LinearGradient
            className="flex-1 w-full p-6 "
            colors={['#FFC453', '#FFE951']}
            start={[0, 1]}
            end={[1, 0]}
            style={{ flex: 1, padding: 6, borderRadius: 15, elevation: 2, justifyContent: 'center', alignItems: 'center' }}
          >
            <View className="flex flex-col justify-center items-center gap-4">
              <Icon className="text-primary-foreground w-24 h-24" />
              <Text className="font-bold2 text-3xl text-primary-foreground">{title}</Text>
            </View>
          </LinearGradient>
        </Pressable>
      </Link>
    </>);
}

