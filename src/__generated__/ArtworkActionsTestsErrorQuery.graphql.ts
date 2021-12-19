/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 4a78baecf8fab09e86a2fe26530db96d */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkActionsTestsErrorQueryVariables = {};
export type ArtworkActionsTestsErrorQueryResponse = {
    readonly artwork: {
        readonly " $fragmentRefs": FragmentRefs<"ArtworkActions_artwork">;
    } | null;
};
export type ArtworkActionsTestsErrorQueryRawResponse = {
    readonly artwork: ({
        readonly id: string;
        readonly internalID: string;
        readonly slug: string;
        readonly title: string | null;
        readonly href: string | null;
        readonly isSaved: boolean | null;
        readonly isHangable: boolean | null;
        readonly artists: ReadonlyArray<({
            readonly name: string | null;
            readonly id: string;
        }) | null> | null;
        readonly image: ({
            readonly url: string | null;
        }) | null;
        readonly sale: ({
            readonly isAuction: boolean | null;
            readonly isClosed: boolean | null;
            readonly id: string;
        }) | null;
        readonly widthCm: number | null;
        readonly heightCm: number | null;
    }) | null;
};
export type ArtworkActionsTestsErrorQuery = {
    readonly response: ArtworkActionsTestsErrorQueryResponse;
    readonly variables: ArtworkActionsTestsErrorQueryVariables;
    readonly rawResponse: ArtworkActionsTestsErrorQueryRawResponse;
};



/*
query ArtworkActionsTestsErrorQuery {
  artwork(id: "artworkID") {
    ...ArtworkActions_artwork
    id
  }
}

fragment ArtworkActions_artwork on Artwork {
  id
  internalID
  slug
  title
  href
  isSaved
  isHangable
  artists {
    name
    id
  }
  image {
    url
  }
  sale {
    isAuction
    isClosed
    id
  }
  widthCm
  heightCm
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "artworkID"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtworkActionsTestsErrorQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ArtworkActions_artwork"
          }
        ],
        "storageKey": "artwork(id:\"artworkID\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "ArtworkActionsTestsErrorQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "internalID",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "slug",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "title",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "href",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isSaved",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isHangable",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Artist",
            "kind": "LinkedField",
            "name": "artists",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "name",
                "storageKey": null
              },
              (v1/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Image",
            "kind": "LinkedField",
            "name": "image",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "url",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Sale",
            "kind": "LinkedField",
            "name": "sale",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isAuction",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isClosed",
                "storageKey": null
              },
              (v1/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "widthCm",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "heightCm",
            "storageKey": null
          }
        ],
        "storageKey": "artwork(id:\"artworkID\")"
      }
    ]
  },
  "params": {
    "id": "4a78baecf8fab09e86a2fe26530db96d",
    "metadata": {},
    "name": "ArtworkActionsTestsErrorQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'f2f1b8004fa40a78682c36a75a79838a';
export default node;
