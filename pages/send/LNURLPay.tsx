import { Stack, router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { LNURLPayServiceResponse, lnurl } from "~/lib/lnurl";
import { Input } from "~/components/ui/input";
import { errorToast } from "~/lib/errorToast";
import Loading from "~/components/Loading";
import { DualCurrencyInput } from "~/components/DualCurrencyInput";

export function LNURLPay() {
  const { lnurlDetailsJSON, originalText } =
    useLocalSearchParams() as unknown as {
      lnurlDetailsJSON: string;
      originalText: string;
    };
  const lnurlDetails: LNURLPayServiceResponse = JSON.parse(lnurlDetailsJSON);
  const [isLoading, setLoading] = React.useState(false);
  const [amount, setAmount] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [addComment, setAddComment] = React.useState(false);

  async function requestInvoice() {
    setLoading(true);
    try {
      const callback = new URL(lnurlDetails.callback);
      callback.searchParams.append("amount", (+amount * 1000).toString());
      if (comment) {
        callback.searchParams.append("comment", comment);
      }
      //callback.searchParams.append("payerdata", JSON.stringify({ test: 1 }));
      const lnurlPayInfo = await lnurl.getPayRequest(callback.toString());
      //console.log("Got pay request", lnurlPayInfo.pr);
      router.push({
        pathname: "/send/confirm",
        params: { invoice: lnurlPayInfo.pr, originalText, comment },
      });
    } catch (error) {
      console.error(error);
      errorToast(error as Error);
    }
    setLoading(false);
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Send",
        }}
      />
      {isLoading && (
        <View className="flex-1 justify-center items-center">
          <Loading />
        </View>
      )}

      {!isLoading && (
        <>
          <TouchableWithoutFeedback
            className="bg-red-500"
            onPress={() => {
              Keyboard.dismiss();
            }}
          >
            <View className="flex-1 flex flex-col">
              <View className="flex-1 justify-center items-center p-6 gap-6">
                <DualCurrencyInput amount={amount} setAmount={setAmount} autoFocus />

                <View className="w-full">
                  <Text className="text-muted-foreground text-center font-semibold2">
                    Comment
                  </Text>
                  <Input
                    className="w-full border-transparent text-center native:text-2xl font-semibold2 text-foreground"
                    placeholder="Enter an optional comment"
                    value={comment}
                    onChangeText={setComment}
                  />
                </View>
                <View>
                  <Text className="text-muted-foreground text-center font-semibold2">
                    To
                  </Text>
                  <Text className="text-center text-foreground text-2xl font-medium2">
                    {originalText}
                  </Text>
                </View>
              </View>
              <View className="p-6">
                <Button size="lg" onPress={requestInvoice}>
                  <Text>Next</Text>
                </Button>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </>
      )}
    </>
  );
}
