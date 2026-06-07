"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { tokenStore } from "@/src/apis/core/token.store";
import { AUTH_VIEW } from "@/src/features/auth/authViews";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { useToast } from "@/src/hooks/useToast";
import {
  FAVORITES_ALL_QUERY_KEY,
  useAddFavorite,
  useGetAllFavorites,
  useRemoveFavorite,
} from "../mutations/property.mutation";
import type { PropertyListing } from "../types/property.types";
import {
  applyFavoriteFlagsToListings,
  buildFavoriteLookup,
  findFavoriteLookupEntry,
} from "../utils/applyFavoriteFlagsToListings";
import {
  resolveFavoritePropertyHash,
  resolveFavoriteResourceId,
} from "../utils/resolveFavoriteResourceId";

type FavouriteDetailsShape = {
  id: number;
  is_favourite?: boolean;
  is_favourite_loading?: boolean;
  property_hash?: string;
};

export function usePropertyFavouriteToggle() {
  const user = useAuthStore((state) => state.user);
  const tFavourites = useTranslations("propertyList.favourites");
  const toast = useToast();
  const queryClient = useQueryClient();
  const [togglingFavoriteId, setTogglingFavoriteId] = useState<string | null>(
    null,
  );

  const { data: allFavoritesResponse } = useGetAllFavorites({
    enabled: Boolean(user),
  });

  const { mutate: addFavorite, isPending: isAddingFavorite } = useAddFavorite();
  const { mutate: removeFavorite, isPending: isRemovingFavorite } =
    useRemoveFavorite();

  const favoriteLookup = useMemo(
    () => buildFavoriteLookup(allFavoritesResponse?.data?.items),
    [allFavoritesResponse?.data?.items],
  );

  const withFavouriteFlags = useCallback(
    (listings: PropertyListing[]) =>
      applyFavoriteFlagsToListings(listings, favoriteLookup),
    [favoriteLookup],
  );

  const withFavouriteLoading = useCallback(
    (listings: PropertyListing[]) => {
      if (!togglingFavoriteId) {
        return listings;
      }

      return listings.map((item) => {
        if (resolveFavoriteResourceId(item) !== togglingFavoriteId) {
          return item;
        }

        return { ...item, is_favourite_loading: true };
      });
    },
    [togglingFavoriteId],
  );

  const invalidateAllFavorites = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: FAVORITES_ALL_QUERY_KEY });
  }, [queryClient]);

  const toggleFavourite = useCallback(
    (item: PropertyListing) => {
      if (isAddingFavorite || isRemovingFavorite) {
        return;
      }

      const { user: currentUser, isLoadingUser } = useAuthStore.getState();
      const hasAccessToken = Boolean(tokenStore.getAccessToken());
      const isAuthenticated =
        Boolean(currentUser) || (hasAccessToken && isLoadingUser);

      if (!isAuthenticated) {
        useAuthStore.getState().openAuth(AUTH_VIEW.chooseAccount);
        return;
      }

      const favoriteResourceId = resolveFavoriteResourceId(item);
      setTogglingFavoriteId(favoriteResourceId);

      if (item.is_favourite) {
        removeFavorite(favoriteResourceId, {
          onSuccess: (response) => {
            toast.success(tFavourites("removeSuccessTitle"), {
              description:
                response.message ?? tFavourites("removeSuccessDescription"),
            });
            setTogglingFavoriteId(null);
            invalidateAllFavorites();
          },
          onError: () => {
            setTogglingFavoriteId(null);
          },
        });
        return;
      }

      addFavorite(resolveFavoritePropertyHash(item), {
        onSuccess: (response) => {
          toast.success(tFavourites("addSuccessTitle"), {
            description:
              response.message ?? tFavourites("addSuccessDescription"),
          });
          setTogglingFavoriteId(null);
          invalidateAllFavorites();
        },
        onError: () => {
          setTogglingFavoriteId(null);
        },
      });
    },
    [
      addFavorite,
      invalidateAllFavorites,
      isAddingFavorite,
      isRemovingFavorite,
      removeFavorite,
      tFavourites,
      toast,
    ],
  );

  const resolveFavouriteToggleItem = useCallback(
    (
      id: number,
      context?: { propertyHash?: string; listings?: PropertyListing[] },
    ): PropertyListing => {
      const fromList = context?.listings?.find((listing) => listing.id === id);

      if (fromList) {
        return fromList;
      }

      const match =
        favoriteLookup.get(String(id)) ??
        (context?.propertyHash
          ? favoriteLookup.get(context.propertyHash)
          : undefined);

      return {
        id,
        property_hash: match?.property_hash ?? context?.propertyHash,
        is_favourite: Boolean(match),
      } as PropertyListing;
    },
    [favoriteLookup],
  );

  const applyDetailsFavouriteState = useCallback(
    <T extends FavouriteDetailsShape>(
      details: T | null | undefined,
      urlPropertyId?: string,
    ): T | undefined => {
      if (!details) {
        return undefined;
      }

      const match = findFavoriteLookupEntry(
        favoriteLookup,
        details.id,
        details.property_hash,
        urlPropertyId,
      );

      const toggleItem = {
        id: details.id,
        property_hash: match?.property_hash ?? details.property_hash,
        is_favourite: Boolean(match),
      } as PropertyListing;

      const isLoading =
        togglingFavoriteId === resolveFavoriteResourceId(toggleItem);

      return {
        ...details,
        is_favourite: Boolean(match),
        is_favourite_loading: isLoading,
        property_hash: match?.property_hash ?? details.property_hash,
        favourite_id: match?.favourite_id,
      };
    },
    [favoriteLookup, togglingFavoriteId],
  );

  const isDetailsFavouriteLoading = useCallback(
    (details: FavouriteDetailsShape, urlPropertyId?: string) => {
      if (!togglingFavoriteId) {
        return false;
      }

      const match = findFavoriteLookupEntry(
        favoriteLookup,
        details.id,
        details.property_hash,
        urlPropertyId,
      );

      const toggleItem = {
        id: details.id,
        property_hash: match?.property_hash ?? details.property_hash,
      } as PropertyListing;

      return togglingFavoriteId === resolveFavoriteResourceId(toggleItem);
    },
    [favoriteLookup, togglingFavoriteId],
  );

  const toggleFavouriteById = useCallback(
    (
      id: number,
      context?: { propertyHash?: string; listings?: PropertyListing[] },
    ) => {
      toggleFavourite(resolveFavouriteToggleItem(id, context));
    },
    [resolveFavouriteToggleItem, toggleFavourite],
  );

  return {
    withFavouriteFlags,
    withFavouriteLoading,
    toggleFavourite,
    toggleFavouriteById,
    applyDetailsFavouriteState,
    isDetailsFavouriteLoading,
    resolveFavouriteToggleItem,
  };
}
