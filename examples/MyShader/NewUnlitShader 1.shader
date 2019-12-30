Shader "Unlit/NewUnlitShader 1"
{
    Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
		_MatCap("MatCap", 2D) = "white" {}
		 _Color("Main Color", Color) = (0.5,0.5,0.5,1)

					_NormalMap("MatCap", 2D) = "white" {}
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" }
        LOD 100

        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            // make fog work
            #pragma multi_compile_fog

            #include "UnityCG.cginc"

            struct appdata
            {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
				float3 normal : NORMAL;
            };

            struct v2f
            {
                float2 uv : TEXCOORD0;
				float2 cap : TEXCOORD1;
                UNITY_FOG_COORDS(1)
                float4 position : SV_POSITION;
            };

            sampler2D _MainTex;
            float4 _MainTex_ST;

			sampler2D _MatCap;
			float4 _MatCap_ST;

			uniform float4 _Color;

            v2f vert (appdata v)
            {
                v2f o;
				//float3 worldNorm = normalize(unity_WorldToObject[0].xyz * v.normal.x + unity_WorldToObject[1].xyz * v.normal.y + unity_WorldToObject[2].xyz * v.normal.z);               
				float3 worldNorm = UnityObjectToWorldNormal(v.normal);
				worldNorm = mul((float3x3)UNITY_MATRIX_V, worldNorm);       

				//float3 worldNorm = UnityObjectToWorldNormal(v.normal);
				o.cap.xy = worldNorm.xy * 0.5 + 0.5;
				o.position = UnityObjectToClipPos(v.vertex);
                return o;
            }

            fixed4 frag (v2f i) : SV_Target
            {
				float4 mc = tex2D(_MatCap, i.cap);

				return  _Color * mc * 2.0;
                //return col;
            }
            ENDCG
        }
    }
}
